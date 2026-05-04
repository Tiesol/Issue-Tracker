import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectFormModal from "./components/ProjectFormModal";

const ProyectosList = () => {
    const [proyectos, setProyectos] = useState([]);
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [createProjectError, setCreateProjectError] = useState("");
    const [editProjectError, setEditProjectError] = useState("");

    const navigate = useNavigate();

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
        const fetchProyectos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProyectos(response.data);
            } catch (error) {
                console.error("Error al obtener sus proyectos:", error);
            }
        };

        fetchProyectos();
    }, [token, navigate]);

    const handleCrearProyecto = async (payload) => {
        setCreateProjectError("");
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/proyectos`, {
                nombre: payload.nombre,
                descripcion: payload.descripcion
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const closeButton = document.getElementById("btnCerrarCrearProyecto");
            if (closeButton) {
                closeButton.click();
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProyectos(response.data);

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error al crear proyecto";
            setCreateProjectError(message);
            console.error("Error al crear proyecto:", error);
        }
    };

    const handleEditarProyecto = async (payload) => {
        if (!selectedProyecto) return;
        setEditProjectError("");
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/proyectos/${selectedProyecto.id}`,
                {
                    nombre: payload.nombre,
                    descripcion: payload.descripcion,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setProyectos((prev) => prev.map((item) => (item.id === selectedProyecto.id ? response.data : item)));
            const closeButton = document.getElementById("btnCerrarEditarProyecto");
            if (closeButton) {
                closeButton.click();
            }
            setSelectedProyecto(null);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error al actualizar proyecto";
            setEditProjectError(message);
            console.error("Error al actualizar proyecto:", error);
        }
    };
    if (!token) {
        return null;
    }

    return ( 
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Mis Proyectos</h2>
                <button 
                    className="btn btn-success fw-bold shadow-sm"
                    data-bs-toggle="modal" 
                    data-bs-target="#crearProyectoModal"
                    onClick={() => setCreateProjectError("")}
                >
                    + Nuevo Proyecto
                </button>
            </div>

            <div className="row">
                {proyectos.length === 0 ? (
                    <div className="col-12 text-center mt-5">
                        <h5 className="text-muted">No tienes proyectos aún. ¡Crea uno para empezar!</h5>
                    </div>
                ) : (
                    proyectos.map((proyecto) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={proyecto.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title fw-bold m-0">{proyecto.nombre}</h5>
                                    </div>
                                    <p className="card-text text-muted">{proyecto.descripcion}</p>
                                </div>
                                <div className="card-footer bg-white border-top-0 pb-3">
                                    <small className="text-muted d-block mb-3">
                                        Creado: {proyecto.createdAt ? new Date(proyecto.createdAt).toLocaleDateString() : 'Sin fecha'}
                                    </small>
                                    <div className="d-flex flex-column gap-2">
                                        <Link to={`/proyectos/${proyecto.id}`} className="btn btn-outline-primary w-100 fw-bold">
                                            Detalles del Proyecto
                                        </Link>
                                        <button
                                            className="btn btn-outline-dark w-100 fw-bold"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editarProyectoModal"
                                            onClick={() => {
                                                setEditProjectError("");
                                                setSelectedProyecto(proyecto);
                                            }}
                                        >
                                            Editar Proyecto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ProjectFormModal
                modalId="crearProyectoModal"
                closeButtonId="btnCerrarCrearProyecto"
                title="Crear Nuevo Proyecto"
                submitLabel="Guardar Proyecto"
                serverError={createProjectError}
                onSave={handleCrearProyecto}
            />

            <ProjectFormModal
                modalId="editarProyectoModal"
                closeButtonId="btnCerrarEditarProyecto"
                title="Editar Proyecto"
                submitLabel="Guardar Cambios"
                initialProyecto={selectedProyecto}
                serverError={editProjectError}
                onSave={handleEditarProyecto}
            />
        </div>
     );
}

export default ProyectosList;