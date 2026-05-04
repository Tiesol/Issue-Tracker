import { useEffect, useState } from "react";

const ProjectFormModal = ({
    modalId,
    closeButtonId,
    title,
    submitLabel,
    initialProyecto,
    resetSignal,
    serverError,
    onSave,
}) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        if (initialProyecto) {
            setNombre(initialProyecto.nombre || "");
            setDescripcion(initialProyecto.descripcion || "");
            return;
        }

        setNombre("");
        setDescripcion("");
    }, [initialProyecto, resetSignal]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        await onSave({
            nombre,
            descripcion,
        });
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={closeButtonId}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Sistema de Inventario"
                                    value={nombre}
                                    onChange={(event) => setNombre(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descripcion</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="¿De que trata este proyecto?"
                                    value={descripcion}
                                    onChange={(event) => setDescripcion(event.target.value)}
                                    required
                                ></textarea>
                            </div>
                            {serverError ? (
                                <div className="alert alert-warning mb-0" role="alert">
                                    {serverError}
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

export default ProjectFormModal;
