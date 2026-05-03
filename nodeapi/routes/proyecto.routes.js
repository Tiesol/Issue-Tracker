const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const { createProyectoSchema, updateProyectoSchema } = require("../validators/proyecto-schema.js");
const requireAuth = require("../middlewares/user.middleware.js");
const proyectoService = require("../services/proyectos.service.js");
const ticketController = require("../controllers/ticket.controller.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/proyecto.controller.js");

    router.use(requireAuth);

    router.get("/", controller.getProyectos);
    router.post("/", isJsonRequestValid, schemaValidation(createProyectoSchema), controller.postProyectoCreate);
    router.get("/:id", getObjectOr404(proyectoService), controller.getDetallesProyecto);
    router.put("/:id", getObjectOr404(proyectoService), isJsonRequestValid, schemaValidation(updateProyectoSchema), controller.putProyectoUpdate);
    router.post("/:id/asignar", getObjectOr404(proyectoService), controller.postAsignarUsuario);
    router.get("/:id/tickets", getObjectOr404(proyectoService), ticketController.getTicketsDeProyecto);
    
    app.use('/proyectos', router);
};