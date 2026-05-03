const proyectoService = require("../services/proyectos.service");

exports.getProyectos = async (req, res) => {
    try{
        const proyectos = await proyectoService.getProyectosDelUsuario(req.user.id);
        res.status(200).json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener proyectos" })
    }
};

exports.postProyectoCreate = async (req, res) => {
    try {
        const proyecto = await proyectoService.createObject({
          ...req.body,
          creadorId: req.user.id,
        });

        res.status(201).json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear el proyecto" })
    }
    
}

exports.putProyectoUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.updateObject({
            id,
            ...req.body,
            creadorId: req.user.id
        });

        if (!proyecto) {
            return res.status(403).json({ message: "No tienes acceso para actualizar este proyecto" });
        }

        res.status(200).json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al actualizar el proyecto" })
    }
};

exports.getDetallesProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.getDetallesProyecto(id, req.user.id);

        if (!proyecto) {
            return res.status(403).json({ message: "No tienes acceso a este proyecto" });
        }

        res.status(200).json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los detalles del proyecto" })
    }
}

exports.postAsignarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Se requiere el email del usuario a invitar" });
        }

        const canAccess = await proyectoService.isUserInProyecto(id, req.user.id);
        if (!canAccess) {
            return res.status(403).json({ message: "No tienes acceso a este proyecto" });
        }

        const usuarioAsignado = await proyectoService.asignarUsuarioAProyecto(id, email);
        if (usuarioAsignado && usuarioAsignado.error) {
            switch (usuarioAsignado.error) {
                case "usuario_no_existe":
                    return res.status(404).json({ message: "Usuario no encontrado" });
                case "usuario_ya_asignado":
                    return res.status(400).json({ message: "El usuario ya pertenece a este proyecto" });
                default:
                    return res.status(500).json({ message: "Error interno al asignar el usuario" });
            }
        }

        res.status(200).json({ 
            message: "Usuario asignado correctamente",
            usuario: usuarioAsignado 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno al asignar el usuario" });
    }
};