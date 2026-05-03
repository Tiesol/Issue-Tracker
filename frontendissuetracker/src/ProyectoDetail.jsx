import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TicketFormModal from "./components/TicketFormModal";
import TicketDetailModal from "./components/TicketDetailModal";

const ProyectoDetail = () => {
    const [proyecto, setProyecto] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [createFormReset, setCreateFormReset] = useState(0);
    const [detailTicket, setDetailTicket] = useState(null);
    const [detailTicketError, setDetailTicketError] = useState("");
    const [createTicketError, setCreateTicketError] = useState("");
    const [editTicketError, setEditTicketError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem("token");
    let miId = null;

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        miId = payload.id;
    }

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchProyecto = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProyecto(response.data);
        };

        const fetchTickets = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos/${id}/tickets`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTickets(response.data);
        };

        const loadData = async () => {
            try {
                setIsLoading(true);
                await Promise.all([fetchProyecto(), fetchTickets()]);
                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login", { replace: true });
                    return;
                }
                setIsLoading(false);
                console.error("Error al cargar el proyecto:", error);
            }
        };

        loadData();
    }, [id, miId, navigate, token]);

    const columnas = useMemo(() => {
        return [
            { key: "pendiente", label: "Pendiente" },
            { key: "en_progreso", label: "En progreso" },
            { key: "completado", label: "Completado" },
        ];
    }, []);

    const prioridadClase = (prioridad) => {
        switch (prioridad) {
            case "alta":
                return "bg-danger";
            case "media":
                return "bg-warning text-dark";
            case "baja":
                return "bg-success";
            default:
                return "bg-secondary";
        }
    };

    const ordenEstados = ["pendiente", "en_progreso", "completado"];
    const puedeRetroceder = (estado) => ordenEstados.indexOf(estado) > 0;
    const puedeAvanzar = (estado) => ordenEstados.indexOf(estado) < ordenEstados.length - 1;

    const miembros = proyecto?.miembros || [];

    const getUserLabel = (userData, fallbackId) => {
        if (userData?.nombre && userData?.email) {
            return `${userData.nombre} (${userData.email})`;
        }
        if (fallbackId) {
            const miembroEncontrado = miembros.find(m => m.id === fallbackId);
            if (miembroEncontrado) {
                return `${miembroEncontrado.nombre} (${miembroEncontrado.email})`;
            }
            return `Usuario #${fallbackId}`;
        }
        return null;
    };

    const handleUnauthorized = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const handleCrearTicket = async (payload) => {
        setCreateTicketError("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/tickets`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTickets((prev) => [response.data, ...prev]);
            const closeButton = document.getElementById("btnCerrarCrearTicket");
            if (closeButton) {
                closeButton.click();
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
                return;
            }
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error al crear ticket";
            setCreateTicketError(message);
            console.error("Error al crear ticket:", error);
        }
    };

    const handleEditarTicket = async (payload) => {
        if (!selectedTicket) return;
        setEditTicketError("");
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/tickets/${selectedTicket.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTickets((prev) => prev.map((ticket) => (ticket.id === selectedTicket.id ? response.data : ticket)));
            const closeButton = document.getElementById("btnCerrarEditarTicket");
            if (closeButton) {
                closeButton.click();
            }
            setSelectedTicket(null);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
                return;
            }
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error al actualizar ticket";
            setEditTicketError(message);
            console.error("Error al actualizar ticket:", error);
        }
    };

    const handleSelectTicket = (ticket) => {
        setEditTicketError("");
        setSelectedTicket(ticket);
    };

    const handleMoveTicket = async (ticket, direction) => {
        const estados = ["pendiente", "en_progreso", "completado"];
        const currentIndex = estados.indexOf(ticket.estado);
        const nextIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
        const nextEstado = estados[nextIndex];

        if (!nextEstado) return;

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/tickets/${ticket.id}`,
                { estado: nextEstado },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTickets((prev) => prev.map((item) => (item.id === ticket.id ? response.data : item)));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
                return;
            }
            console.error("Error al mover ticket:", error);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
                return;
            }
            console.error("Error al eliminar ticket:", error);
        }
    };

    const handleShowTicketDetail = (ticket) => {
        setDetailTicketError("");
        setDetailTicket(ticket);
    };

    if (!token) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <p className="text-muted">Cargando proyecto...</p>
            </div>
        );
    }

    if (!proyecto) {
        return (
            <div className="container mt-5 text-center">
                <p className="text-muted">No se encontraron datos del proyecto.</p>
            </div>
        );
    }

    const esPropietario = proyecto.creador_id === miId || proyecto.creadorId === miId;

    return (
        <div className="container mt-5">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <h2 className="fw-bold m-0">{proyecto.nombre}</h2>
                        {esPropietario ? (
                            <span className="badge bg-primary">Propietario</span>
                        ) : (
                            <span className="badge bg-secondary">Invitado</span>
                        )}
                    </div>
                    <p className="text-muted mb-2">{proyecto.descripcion}</p>
                    <small className="text-muted">
                        Creado: {proyecto.createdAt ? new Date(proyecto.createdAt).toLocaleDateString() : "Sin fecha"}
                    </small>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/proyectos" className="btn btn-outline-secondary">
                        Volver
                    </Link>
                    <button
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#crearTicketModal"
                        onClick={() => {
                            setCreateTicketError("");
                            setSelectedTicket(null);
                            setCreateFormReset((prev) => prev + 1);
                        }}
                    >
                        + Nuevo Ticket
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {columnas.map((columna) => (
                    <div className="col-12 col-lg-4" key={columna.key}>
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-white">
                                <h5 className="fw-bold m-0">{columna.label}</h5>
                            </div>
                            <div className="card-body d-flex flex-column gap-3">
                                {tickets
                                    .filter((ticket) => ticket.estado === columna.key)
                                    .map((ticket) => (
                                        <div className="card border-0 shadow-sm" key={ticket.id}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="fw-bold mb-0">{ticket.titulo}</h6>
                                                    <span className={`badge ${prioridadClase(ticket.prioridad)}`}>
                                                        {ticket.prioridad}
                                                    </span>
                                                </div>
                                                <p className="text-muted mb-3">{ticket.descripcion}</p>
                                                <button
                                                    className="btn btn-outline-primary btn-sm w-100"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#detalleTicketModal"
                                                    onClick={() => handleShowTicketDetail(ticket)}
                                                >
                                                    Ver detalles del ticket
                                                </button>
                                                <div className="d-flex justify-content-between gap-2 mt-3">
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        disabled={!puedeRetroceder(ticket.estado)}
                                                        onClick={() => handleMoveTicket(ticket, "back")}
                                                    >
                                                        Retroceder
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        disabled={!puedeAvanzar(ticket.estado)}
                                                        onClick={() => handleMoveTicket(ticket, "forward")}
                                                    >
                                                        Avanzar
                                                    </button>
                                                </div>
                                            </div>
                                            {ticket.createdAt ? (
                                                <div className="card-footer bg-white border-top-0">
                                                    <div className="d-flex align-items-center justify-content-between gap-2">
                                                        <small className="text-muted">
                                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                                        </small>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-outline-dark btn-sm"
                                                                onClick={() => handleSelectTicket(ticket)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editarTicketModal"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDeleteTicket(ticket.id)}
                                                            >
                                                                Borrar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <TicketFormModal
                modalId="crearTicketModal"
                closeButtonId="btnCerrarCrearTicket"
                title="Crear Ticket"
                submitLabel="Crear Ticket"
                proyectoId={Number(id)}
                miembros={miembros}
                serverError={createTicketError}
                resetSignal={createFormReset}
                onSave={handleCrearTicket}
            />

            <TicketFormModal
                modalId="editarTicketModal"
                closeButtonId="btnCerrarEditarTicket"
                title="Editar Ticket"
                submitLabel="Guardar Cambios"
                miembros={miembros}
                initialTicket={selectedTicket}
                serverError={editTicketError}
                onSave={handleEditarTicket}
            />

            <TicketDetailModal
                modalId="detalleTicketModal"
                closeButtonId="btnCerrarDetalleTicket"
                ticket={detailTicket}
                assignedName={getUserLabel(detailTicket?.usuario_asignado, detailTicket?.usuario_asignado_id)}
                creatorName={getUserLabel(detailTicket?.creador_ticket, detailTicket?.creador_id)}
                errorMessage={detailTicketError}
            />
        </div>
    );
};

export default ProyectoDetail;
