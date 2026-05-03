const getObjectOr404 = (service) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const object = await service.getById(id);
        if (!object) {
            return res.status(404).json({ message: "Object not found" });
        }
        req.obj = object;
        next();
    };
};
module.exports = getObjectOr404;