const TicketDetailModal = ({
    modalId,
    closeButtonId,
    ticket,
    assignedName,
    creatorName,
    errorMessage,
}) => {
    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Detalle del Ticket</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={closeButtonId}></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage ? (
                            <div className="alert alert-warning" role="alert">
                                {errorMessage}
                            </div>
                        ) : null}
                        {!errorMessage && ticket ? (
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <small className="text-muted d-block">Titulo</small>
                                    <div className="fw-bold">{ticket.titulo}</div>
                                </div>
                                <div>
                                    <small className="text-muted d-block">Descripcion</small>
                                    <div>{ticket.descripcion}</div>
                                </div>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <small className="text-muted d-block">Estado</small>
                                        <div className="text-capitalize">{ticket.estado?.replace("_", " ")}</div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <small className="text-muted d-block">Prioridad</small>
                                        <div className="text-capitalize">{ticket.prioridad}</div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <small className="text-muted d-block">Responsable</small>
                                        <div>{assignedName || "Sin asignar"}</div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <small className="text-muted d-block">Creador</small>
                                        <div>{creatorName || "Sin datos"}</div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <small className="text-muted d-block">Fecha de creacion</small>
                                        <div>
                                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Sin fecha"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailModal;
