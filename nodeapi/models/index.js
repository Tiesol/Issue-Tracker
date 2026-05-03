    const { sequelize } = require('../config/db.config');

    const usuario = require('./usuario.model')(sequelize);
    const proyecto = require('./proyecto.model')(sequelize);
    const ticket = require('./ticket.model')(sequelize);
    const proyectoAsignacion = require('./proyecto_asignacion.model')(sequelize);

    //Relaciones
    // Un usuario puede crear muchos proyectos
    usuario.hasMany(proyecto, {
        foreignKey: 'creador_id',
        as: 'proyectos_creados'
    });
    proyecto.belongsTo(usuario, { 
        foreignKey: 'creador_id',
        as: 'creador_proyecto'
    });

    // Un proyecto puede tener muchos tickets
    proyecto.hasMany(ticket, {
        foreignKey: 'proyecto_id',
        as: 'tickets'
    });
    ticket.belongsTo(proyecto, { 
        foreignKey: 'proyecto_id',
        as: 'proyecto'
    });

    // Un usuario puede ser asignado a muchos tickets
    usuario.hasMany(ticket, {
        foreignKey: 'usuario_asignado_id',
        as: 'tickets_asignados'
    });
    ticket.belongsTo(usuario, { 
        foreignKey: 'usuario_asignado_id',
        as: 'usuario_asignado'  
    });

    // Un usuario puede crear muchos tickets
    usuario.hasMany(ticket, {
        foreignKey: 'creador_id',
        as: 'tickets_creados'
    });
    ticket.belongsTo(usuario, { 
        foreignKey: 'creador_id',
        as: 'creador_ticket'
    });

    // Un proyecto puede tener muchos usuarios asignados a través de ProyectoAsignacion
    proyecto.belongsToMany(usuario, {
        through: proyectoAsignacion,
        foreignKey: 'proyecto_id',
        otherKey: 'usuario_id',
        as: 'miembros'
    });
    usuario.belongsToMany(proyecto, {
        through: proyectoAsignacion,
        foreignKey: 'usuario_id',
        otherKey: 'proyecto_id',
        as: 'proyectos_asignados'
    });



    module.exports = {
        usuario,
        ticket,
        proyecto,
        proyectoAsignacion,
        sequelize,
        Sequelize: sequelize.Sequelize
    }