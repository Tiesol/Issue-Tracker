import { useEffect, useState } from "react";

const TicketFormModal = ({
    modalId,
    closeButtonId,
    title,
    submitLabel,
    proyectoId,
    miembros,
    initialTicket,
    serverError,
    onSave,
}) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("pendiente");
    const [prioridad, setPrioridad] = useState("media");
    const [usuarioAsignadoId, setUsuarioAsignadoId] = useState("");
    const [formError, setFormError] = useState("");

    const allowCompleted = Boolean(initialTicket);

    useEffect(() => {
        if (initialTicket) {
            setTitulo(initialTicket.titulo || "");
            setDescripcion(initialTicket.descripcion || "");
            setEstado(initialTicket.estado || "pendiente");
            setPrioridad(initialTicket.prioridad || "media");
            setUsuarioAsignadoId(
                initialTicket.usuario_asignado_id !== null && initialTicket.usuario_asignado_id !== undefined
                    ? String(initialTicket.usuario_asignado_id)
                    : ""
            );
            setFormError("");
            return;
        }

        setTitulo("");
        setDescripcion("");
        setEstado("pendiente");
        setPrioridad("media");
        setUsuarioAsignadoId("");
        setFormError("");
    }, [initialTicket]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        if (estado === "en_progreso" && !usuarioAsignadoId) {
            setFormError("Debes asignar un responsable para iniciar un ticket.");
            return;
        }

        const payload = {
            titulo,
            descripcion,
            estado,
            prioridad,
            usuario_asignado_id: usuarioAsignadoId ? Number(usuarioAsignadoId) : null,
        };

        if (proyectoId) {
            payload.proyecto_id = proyectoId;
        }

        await onSave(payload);
    };

    const displayError = formError || serverError;

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={closeButtonId}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Titulo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={titulo}
                                        onChange={(event) => setTitulo(event.target.value)}
                                        placeholder="Ej: Ajustar validaciones"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Descripcion</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={descripcion}
                                        onChange={(event) => setDescripcion(event.target.value)}
                                        placeholder="Describe el trabajo a realizar"
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={estado}
                                        onChange={(event) => setEstado(event.target.value)}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_progreso">En progreso</option>
                                        {allowCompleted ? (
                                            <option value="completado">Completado</option>
                                        ) : null}
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Prioridad</label>
                                    <select
                                        className="form-select"
                                        value={prioridad}
                                        onChange={(event) => setPrioridad(event.target.value)}
                                    >
                                        <option value="baja">Baja</option>
                                        <option value="media">Media</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Responsable</label>
                                    <select
                                        className="form-select"
                                        value={usuarioAsignadoId}
                                        onChange={(event) => setUsuarioAsignadoId(event.target.value)}
                                    >
                                        <option value="">Sin asignar</option>
                                        {miembros.map((miembro) => (
                                            <option key={miembro.id} value={miembro.id}>
                                                {miembro.nombre} ({miembro.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {displayError ? (
                                <div className="alert alert-warning mt-3 mb-0" role="alert">
                                    {displayError}
                                </div>
                            ) : null}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success">
                                {submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketFormModal;
