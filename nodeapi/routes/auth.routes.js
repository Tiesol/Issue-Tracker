const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const { registerUserSchema, loginUserSchema } = require("../validators/user.schema.js");
const requireAuth = require("../middlewares/user.middleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/auth.controller.js");
    router.post('/register', isJsonRequestValid, schemaValidation(registerUserSchema), controller.postRegister);
    router.post('/login', isJsonRequestValid, schemaValidation(loginUserSchema), controller.postLogin);
    router.post('/logout', requireAuth, controller.postLogout);
    app.use('/auth', router);
};