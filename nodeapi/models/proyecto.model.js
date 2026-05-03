const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const Proyecto = sequelize.define(
        'Proyecto',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            creador_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

        },
    );
    return Proyecto;
}