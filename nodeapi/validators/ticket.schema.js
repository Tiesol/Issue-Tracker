const Joi = require("joi");

const createTicketSchema = Joi.object({
    titulo: Joi.string().trim().min(1).required(),
    
    descripcion: Joi.string().trim().min(1).required(), 

    estado: Joi.string().valid("pendiente", "en_progreso").optional(),
    prioridad: Joi.string().valid("baja", "media", "alta").optional(),
    
    proyecto_id: Joi.number().integer().required(),
    
    usuario_asignado_id: Joi.number().integer().allow(null).when("estado", {
        is: "en_progreso",
        then: Joi.number().integer().required()
    })
});

const updateTicketSchema = Joi.object({
    titulo: Joi.string().trim().min(1).optional(),
    
    descripcion: Joi.string().trim().min(1).optional(),
    
    estado: Joi.string().valid("pendiente", "en_progreso", "completado").optional(),
    prioridad: Joi.string().valid("baja", "media", "alta").optional(),
    
    usuario_asignado_id: Joi.number().integer().allow(null).optional()
}).min(1);

module.exports = {
    createTicketSchema,
    updateTicketSchema
};