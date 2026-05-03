const db = require("../models");
const usuarioService = {

    findUserByEmail: async (email) => {
        return await db.usuario.findOne({ 
            where: { 
                email 
            } 
        });
    },

    createObject: async ({ nombre, email, password }) => {
        return await db.usuario.create({
            nombre,
            email,
            password,
        });
    },

    getById: async (id) => {
        return await db.usuario.findByPk(id);
    },
    updateObject: async (id, { nombre, email, password }) => {
        const usuario = await usuarioService.getById(id);
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.password = password;
        return await usuario.save();
    },
    
    deleteObject: async (id) => {
        const usuario = await usuarioService.getById(id);
        return await usuario.destroy();
    }
}
module.exports = usuarioService;



