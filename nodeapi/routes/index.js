module.exports = app => {
    require('./proyecto.routes')(app);
    require('./auth.routes')(app);
    require('./ticket.routes')(app);
}