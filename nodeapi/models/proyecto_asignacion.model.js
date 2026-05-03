const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    const ProyectoAsignacion = sequelize.define(
        'ProyectoAsignacion',
        {
            proyecto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
        },
        {
            timestamps: false,
        }
    );
    return ProyectoAsignacion;
}
