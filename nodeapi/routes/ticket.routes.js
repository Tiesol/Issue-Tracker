const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware.js");
const requireAuth = require("../middlewares/user.middleware.js");
const schemaValidation = require("../middlewares/schemaValidation.middleware.js");
const { createTicketSchema, updateTicketSchema } = require("../validators/ticket.schema.js");

const ticketService = require("../services/tickets.service.js");
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/ticket.controller.js");

    router.use(requireAuth);

    router.post("/", isJsonRequestValid, schemaValidation(createTicketSchema), controller.postTicketCreate);
    router.get("/:id", getObjectOr404(ticketService), controller.getTicketDetalle);
    router.put("/:id", getObjectOr404(ticketService), isJsonRequestValid, schemaValidation(updateTicketSchema), controller.putTicketUpdate);
    router.delete("/:id", getObjectOr404(ticketService), controller.deleteTicket);

    app.use('/tickets', router);
};