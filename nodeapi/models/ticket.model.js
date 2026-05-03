const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const Ticket = sequelize.define(
        'Ticket',
        {
            titulo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            estado: {
                type: DataTypes.ENUM('pendiente', 'en_progreso', 'completado'),
                allowNull: false
            },
            prioridad: {
                type: DataTypes.ENUM('baja', 'media', 'alta'),
                allowNull: false
            },
            proyecto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
             usuario_asignado_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            creador_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
    );
    return Ticket;
}