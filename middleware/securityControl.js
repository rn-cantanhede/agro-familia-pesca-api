const secureLogger = require("../config/secureLogger");
const knex = require("../database/connection");
const secureKnex = require("../database/connectionSecute");
const Erros = require("../shared/errors/Errors");
const table = "security_controls";

//Bloqueia endpoints expecificos.
//Exemplo /admin/usuarios/3
function routeControl(value) {
    return value.some(element => {
        return element.control_type === "route" &&
            element.enabled === 1 &&
            element.expires > new Date();
    });
};

//Bloqueia fetures. 
// Como uma operação GRUD(criação, leitura, atualização ou deletar) 
function featureControl(value) {
    return value.some(element => {
        return element.control_type === "feature" &&
            element.enabled === 1 &&
            element.expires > new Date();
    });
};

//Bloqueia recursos globais. 
// Exemplo: /admin/usuarios, /admin/, 
// /usuarios/(de todas as rotas) ou /(bloqueio de todos os endpoits)

function globalControl(value) {
    return value.some(element => {
        return element.control_type === "global" &&
            element.enabled === 1 &&
            element.expires > new Date();
    });
};

//Revoga sessões que acessa uma rota ou de toda api. 
// Exemplo: /, /admin/usuarios, /admin/, /admin/programas/3
// /usuarios/(revoga token de todas as rotas) ou /(revoga token de todos os endpoits)
function tokenControl(value) {
    return value.some(element => {
        return element.control_type === "token" &&
            element.enabled === 1 &&
            element.expires > new Date();
    });
};

module.exports = async function securityControl(req, res, next) {
    //Verifica se existe bloqueio global de todas os endpoits
    const getGlobal = await secureKnex
        .select("*")
        .table(table)
        .where("target_value", "/");

    if (globalControl(getGlobal)) {
        req.log.error({
            event: "SECURE_API",
            resource: "api",
            action: "block",
        }, "Todos os endpoints foram bloqueados");

        secureLogger.error({
            event: "SECURE_API",
            resource: "api",
            action: "block"
        }, "Todos os endpoints foram bloqueados");

        return next(new Erros("Erro interno no servidor", 500));
    };

    const get = await secureKnex
        .select("*")
        .table(table)
        .where("target_value", req.path);

    if (routeControl(get) || featureControl(get) || globalControl(get)) {
        req.log.error({
            event: "SECURE_API",
            resource: "api",
            action: "block",
        }, `Endpoints foram bloqueados: ${req.path}`);

        secureLogger.error({
            event: "SECURE_API",
            resource: "api",
            action: "block"
        }, `Endpoints foram bloqueados: ${req.path}`);
        return next(new Erros("Erro interno no servidor", 500));
    };

    if (tokenControl(get)) {
        await knex.table("sessoes")
        .where("ID_PESSOA", req.session.user.id)
        .update("REVOGADO", new Date());

        req.log.error({
            event: "SECURE_API",
            resource: "api",
            action: "block",
        }, `Token revogado: ${req.session.user.login}`);

        secureLogger.error({
            event: "SECURE_API",
            resource: "api",
            action: "block"
        }, `Token revogado: ${req.session.user.login}`);
        return next(new Erros("Erro interno no servidor", 500));
    };

    return next();
};