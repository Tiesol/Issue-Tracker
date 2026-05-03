const db = require("../models");
const proyectoService = require("./proyectos.service");

const ticketService = {
    isValidTransition: (from, to) => {
        if (from === to) return true;
        const allowed = {
            pendiente: ['en_progreso'],
            en_progreso: ['pendiente', 'completado'],
            completado: ['en_progreso']
        };

        return (allowed[from] || []).includes(to);
    },

    getTicketsPorProyecto: async (proyectoId) => {
        return await db.ticket.findAll({
            include: [
                {
                    model: db.usuario,
                    as: 'usuario_asignado',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: db.usuario,
                    as: 'creador_ticket',
                    attributes: ['id', 'nombre', 'email']
                }
            ],
            where: {
                proyecto_id: proyectoId
            },
            order: [['createdAt', 'DESC']]
        });
    },

    createObject: async ({ titulo, descripcion, estado, prioridad, proyecto_id, usuario_asignado_id, creador_id }) => {
        const userCanAccess = await proyectoService.isUserInProyecto(proyecto_id, creador_id);
        if (!userCanAccess) {
            return { error: "proyecto_sin_acceso" };
        }

        const estadoFinal = estado || 'pendiente';

        if (estadoFinal === 'completado') {
            return { error: "estado_invalido" };
        }

        if (estadoFinal === 'en_progreso' && (usuario_asignado_id === null || usuario_asignado_id === undefined)) {
            return { error: "responsable_requerido" };
        }

        if (usuario_asignado_id !== null && usuario_asignado_id !== undefined) {
            const isMember = await proyectoService.isUserInProyecto(proyecto_id, usuario_asignado_id);
            if (!isMember) {
                return { error: "usuario_no_pertenece_proyecto" };
            }
        }

        return await db.ticket.create({
            titulo,
            descripcion,
            estado: estadoFinal, 
            prioridad: prioridad || 'media',
            proyecto_id,
            usuario_asignado_id,
            creador_id
        });
    },

    getById: async (id) => {
        return await db.ticket.findByPk(id);
    },

    updateObject: async (id, data) => {
        const ticket = await db.ticket.findByPk(id);
        
        if (!ticket) return null;

        if (data.estado && !ticketService.isValidTransition(ticket.estado, data.estado)) {
            return { error: "estado_transicion_invalida" };
        }

        if (data.estado === 'en_progreso') {
            const responsableId = data.usuario_asignado_id !== undefined
                ? data.usuario_asignado_id
                : ticket.usuario_asignado_id;

            if (responsableId === null || responsableId === undefined) {
                return { error: "responsable_requerido" };
            }
        }

        if (data.usuario_asignado_id !== null && data.usuario_asignado_id !== undefined) {
            const isMember = await proyectoService.isUserInProyecto(ticket.proyecto_id, data.usuario_asignado_id);
            if (!isMember) {
                return { error: "usuario_no_pertenece_proyecto" };
            }
        }

        ticket.set(data);
        return await ticket.save();
    },

    deleteObject: async (id) => {
        const ticket = await db.ticket.findByPk(id);
        
        if (!ticket) return null;

        return await ticket.destroy();
    }
};

module.exports = ticketService;