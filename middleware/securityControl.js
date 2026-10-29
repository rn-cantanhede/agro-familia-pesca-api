const secureKnex = require("../database/connectionSecute");
const Erros = require("../shared/errors/Errors");
const table = "security_controls";

function routeControl(value) {
    return value.some(element => {
        return element.control_type === "route" &&
            element.enabled === 0 &&
            element.expires > new Date();
    });
};

module.exports = async function securityControl(req, res, next) {
    const get = await secureKnex
        .select("*")
        .table(table)
        .where("target_value", req.path);

    console.log(req.method);
    console.log(req.path);
    console.log(req.url);
    console.log(req.originalUrl);

    if (routeControl(get)) {
        return next(new Erros("Rota fudida"));
    } else {
        return next();
    };
};