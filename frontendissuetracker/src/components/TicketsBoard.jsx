const TicketsBoard = ({
    columnas,
    tickets,
    prioridadClase,
    puedeRetroceder,
    puedeAvanzar,
    onShowTicketDetail,
    onMoveTicket,
    onSelectTicket,
    onDeleteTicket,
}) => {
    return (
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
                                                onClick={() => onShowTicketDetail(ticket)}
                                            >
                                                Ver detalles del ticket
                                            </button>
                                            <div className="d-flex justify-content-between gap-2 mt-3">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    disabled={!puedeRetroceder(ticket.estado)}
                                                    onClick={() => onMoveTicket(ticket, "back")}
                                                >
                                                    Retroceder
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    disabled={!puedeAvanzar(ticket.estado)}
                                                    onClick={() => onMoveTicket(ticket, "forward")}
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
                                                            onClick={() => onSelectTicket(ticket)}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editarTicketModal"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => onDeleteTicket(ticket.id)}
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
    );
};

export default TicketsBoard;
