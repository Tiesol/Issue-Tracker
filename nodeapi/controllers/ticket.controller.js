const ticketService = require("../services/tickets.service");
const proyectoService = require("../services/proyectos.service");

exports.getTicketsDeProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const canAccess = await proyectoService.isUserInProyecto(id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes permisos para ver los tickets de este proyecto" });
        }
        const tickets = await ticketService.getTicketsPorProyecto(id);
        
        res.status(200).json(tickets);
    } catch (error) {   
        console.log(error);
        res.status(500).json({ message: "Error al obtener los tickets del proyecto" });
    }
};

exports.postTicketCreate = async (req, res) => {
    try {
        const canAccess = await proyectoService.isUserInProyecto(req.body.proyecto_id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes acceso a este proyecto" });
        }

        if (req.body.usuario_asignado_id !== undefined && req.body.usuario_asignado_id !== null) {
            const isMember = await proyectoService.isUserInProyecto(req.body.proyecto_id, req.body.usuario_asignado_id);
            if (!isMember) {
                return res.status(400).json({ message: "El usuario asignado no pertenece al proyecto" });
            }
        }

        const ticket = await ticketService.createObject({
            ...req.body,
            creador_id: req.user.id
        });

        if (ticket && ticket.error) {
            switch (ticket.error) {
                case "proyecto_sin_acceso":
                    return res.status(403).json({ message: "No tienes acceso a este proyecto" });
                case "estado_invalido":
                    return res.status(400).json({ message: "No puedes crear un ticket en estado completado" });
                case "responsable_requerido":
                    return res.status(400).json({ message: "No puedes iniciar un ticket sin responsable asignado" });
                case "usuario_no_pertenece_proyecto":
                    return res.status(400).json({ message: "El usuario asignado no pertenece al proyecto" });
                default:
                    return res.status(500).json({ message: "Error al crear el ticket" });
            }
        }

        res.status(201).json(ticket);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear el ticket" });
    }
};

exports.putTicketUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const canAccess = await proyectoService.isUserInProyecto(req.obj.proyecto_id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes permisos para actualizar este ticket" });
        }

        if (req.body.usuario_asignado_id !== undefined && req.body.usuario_asignado_id !== null) {
            const isMember = await proyectoService.isUserInProyecto(req.obj.proyecto_id, req.body.usuario_asignado_id);
            if (!isMember) {
                return res.status(400).json({ message: "El usuario asignado no pertenece al proyecto" });
            }
        }
        
        const ticketActualizado = await ticketService.updateObject(id, req.body);

        if (ticketActualizado && ticketActualizado.error) {
            switch (ticketActualizado.error) {
                case "responsable_requerido":
                    return res.status(400).json({ message: "No puedes iniciar un ticket sin responsable asignado" });
                case "estado_transicion_invalida":
                    return res.status(400).json({ message: "Transición de estado inválida" });
                case "usuario_no_pertenece_proyecto":
                    return res.status(400).json({ message: "El usuario asignado no pertenece al proyecto" });
                default:
                    return res.status(500).json({ message: "Error al actualizar el ticket" });
            }
        }

        res.status(200).json(ticketActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al actualizar el ticket" });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const canAccess = await proyectoService.isUserInProyecto(req.obj.proyecto_id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes permisos para eliminar este ticket" });
        }
        
        await ticketService.deleteObject(id);

        res.status(200).json({ message: "Ticket eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar el ticket" });
    }
};

exports.getTicketDetalle = async (req, res) => {
    try {
        const ticket = req.obj;
        const canAccess = await proyectoService.isUserInProyecto(ticket.proyecto_id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes permisos para ver este ticket" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el ticket" });
    }
};