import { Link } from "react-router-dom";

const ProjectHeader = ({ proyecto, onNewTicket, onAssignUser }) => {
    return (
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-4 gap-3">
            <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <h2 className="fw-bold m-0">{proyecto.nombre}</h2>
                </div>
                <p className="text-muted mb-2">{proyecto.descripcion}</p>
                <small className="text-muted">
                    Creado: {proyecto.createdAt ? new Date(proyecto.createdAt).toLocaleDateString() : "Sin fecha"}
                </small>
            </div>
            <div className="d-flex gap-2 flex-wrap">
                <Link to="/proyectos" className="btn btn-outline-secondary">
                    Volver
                </Link>
                {onAssignUser ? (
                    <button
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#asignarUsuarioModal"
                        onClick={onAssignUser}
                    >
                        Asignar usuario
                    </button>
                ) : null}
                <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#crearTicketModal"
                    onClick={onNewTicket}
                >
                    + Nuevo Ticket
                </button>
            </div>
        </div>
    );
};

export default ProjectHeader;
