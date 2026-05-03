import { useEffect, useState } from "react";

const AssignUserModal = ({
    modalId,
    closeButtonId,
    serverError,
    successMessage,
    isSubmitting,
    resetSignal,
    onSubmit,
}) => {
    const [email, setEmail] = useState("");

    useEffect(() => {
        setEmail("");
    }, [resetSignal]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        await onSubmit(email);
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Asignar usuario</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={closeButtonId}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Correo del usuario</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                            {serverError ? (
                                <div className="alert alert-warning mb-0" role="alert">
                                    {serverError}
                                </div>
                            ) : null}
                            {!serverError && successMessage ? (
                                <div className="alert alert-success mb-0" role="alert">
                                    {successMessage}
                                </div>
                            ) : null}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Asignar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignUserModal;
