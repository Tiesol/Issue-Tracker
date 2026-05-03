const Joi = require("joi");

const createProyectoSchema = Joi.object({
    nombre: Joi.string().trim().min(1).required(),
    descripcion: Joi.string().trim().min(1).required()
});

const updateProyectoSchema = Joi.object({
    nombre: Joi.string().trim().min(1).required(),
    descripcion: Joi.string().trim().min(1).required()
});

module.exports = {
    createProyectoSchema,
    updateProyectoSchema
};