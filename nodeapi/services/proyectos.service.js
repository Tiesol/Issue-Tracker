const db = require("../models");
const { Op } = require("sequelize");
const proyectoService = {

    getProyectosDelUsuario: async (userId) => {
        return db.proyecto.findAll({ 
            include: [
                {
                    model: db.usuario,
                    as: 'miembros',
                    attributes: [],
                }
            ],
            where: {
                [Op.or]: [
                    { creador_id: userId },
                    { '$miembros.id$': userId }
                ]
            }
        });
    },

    isUserInProyecto: async (id, userId) => {
        const proyecto = await db.proyecto.findOne({
            include: [
                {
                    model: db.usuario,
                    as: 'miembros',
                    attributes: [],
                }
            ],
            where: {
                id,
                [Op.or]: [
                    { creador_id: userId },
                    { '$miembros.id$': userId }
                ]
            }
        });

        return !!proyecto;
    },

    getById: async (id) => {
        return await db.proyecto.findByPk(id);
    },

    createObject: async ({ nombre, descripcion, creadorId }) => {
        const proyecto = await db.proyecto.create({
            nombre,
            descripcion,
            creador_id: creadorId   
        });

        await proyecto.addMiembro(creadorId);

        return proyecto;
    },

    updateObject: async ({ id, nombre, descripcion, creadorId }) => {
        const proyecto = await db.proyecto.findOne({
            include: [
                {
                    model: db.usuario,
                    as: 'miembros',
                    attributes: [],
                }
            ],
            where: {
                id: id,
                [Op.or]: [
                    { creador_id: creadorId },
                    { '$miembros.id$': creadorId }
                ]
            }
        });

        if(!proyecto) return null;

        proyecto.nombre = nombre;
        proyecto.descripcion = descripcion;

        return await proyecto.save();
    },
    
    getDetallesProyecto: async (id, userId) => {
        const canAccess = await proyectoService.isUserInProyecto(id, userId);
        if (!canAccess) return null;

        return await db.proyecto.findByPk(id, {
            include: [
                {
                    model: db.usuario,
                    as: 'miembros',
                    attributes: ['id', 'nombre', 'email']
                }
            ]
        });
    },

    asignarUsuarioAProyecto: async (id, emailUsuarioInvitado) => {
        const proyecto = await db.proyecto.findByPk(id);

        const usuarioInvitado = await db.usuario.findOne({
            where: { email: emailUsuarioInvitado }
        });

        if (!usuarioInvitado) {
            return { error: "usuario_no_existe" };
        }

        const miembros = await proyecto.getMiembros({ where: { id: usuarioInvitado.id } });
        const alreadyMember = miembros.length > 0;

        if (alreadyMember) {
            return { error: "usuario_ya_asignado" };
        }

        await proyecto.addMiembro(usuarioInvitado.id);

        return {
            id: usuarioInvitado.id,
            nombre: usuarioInvitado.nombre,
            email: usuarioInvitado.email
        };
    }
}
module.exports = proyectoService;



