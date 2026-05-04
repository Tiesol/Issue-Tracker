import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssignUserModal from "./components/AssignUserModal";
import ProjectHeader from "./components/ProjectHeader";
import TicketDetailModal from "./components/TicketDetailModal";
import TicketFormModal from "./components/TicketFormModal";
import TicketsBoard from "./components/TicketsBoard";

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
    const [assignUserError, setAssignUserError] = useState("");
    const [assignUserSuccess, setAssignUserSuccess] = useState("");
    const [assignUserLoading, setAssignUserLoading] = useState(false);
    const [assignUserReset, setAssignUserReset] = useState(0);
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

    const handleOpenAssignUser = () => {
        setAssignUserError("");
        setAssignUserSuccess("");
        setAssignUserReset((prev) => prev + 1);
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

    const handleAsignarUsuario = async (email) => {
        setAssignUserError("");
        setAssignUserSuccess("");
        setAssignUserLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proyectos/${id}/asignar`,
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAssignUserSuccess(response.data?.message || "Usuario asignado correctamente");
            setProyecto((prev) => {
                if (!prev) return prev;
                const nuevoMiembro = response.data?.usuario;
                if (!nuevoMiembro) return prev;
                const miembrosActuales = prev.miembros || [];
                const yaExiste = miembrosActuales.some((miembro) => miembro.id === nuevoMiembro.id);
                if (yaExiste) return prev;
                return { ...prev, miembros: [...miembrosActuales, nuevoMiembro] };
            });
            const closeButton = document.getElementById("btnCerrarAsignarUsuario");
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
                "Error al asignar usuario";
            setAssignUserError(message);
            console.error("Error al asignar usuario:", error);
        } finally {
            setAssignUserLoading(false);
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
            <ProjectHeader
                proyecto={proyecto}
                esPropietario={esPropietario}
                onAssignUser={handleOpenAssignUser}
                onNewTicket={() => {
                    setCreateTicketError("");
                    setSelectedTicket(null);
                    setCreateFormReset((prev) => prev + 1);
                }}
            />

            <TicketsBoard
                columnas={columnas}
                tickets={tickets}
                prioridadClase={prioridadClase}
                puedeRetroceder={puedeRetroceder}
                puedeAvanzar={puedeAvanzar}
                onShowTicketDetail={handleShowTicketDetail}
                onMoveTicket={handleMoveTicket}
                onSelectTicket={handleSelectTicket}
                onDeleteTicket={handleDeleteTicket}
            />

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

            <AssignUserModal
                modalId="asignarUsuarioModal"
                closeButtonId="btnCerrarAsignarUsuario"
                serverError={assignUserError}
                successMessage={assignUserSuccess}
                isSubmitting={assignUserLoading}
                resetSignal={assignUserReset}
                onSubmit={handleAsignarUsuario}
            />
        </div>
    );
};

export default ProyectoDetail;
