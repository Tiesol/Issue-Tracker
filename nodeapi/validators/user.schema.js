const Joi = require("joi");

const registerUserSchema = Joi.object({
    nombre: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
module.exports = {
    registerUserSchema,
    loginUserSchema
};