const knexconfig = require("../config/SecuteKnex");
const logger = require("../config/logger");
/**
 * Instância única do Knex configurada para acesso ao banco de dados.
 */

if (!knexconfig) {
    logger.error({
        event: "CONNECTION_ERROR",
        resource: "dynamic_security_controls",
        action: "connection"
    }, "Configuração do Knex não encontrada. Verifique NODE_ENV");

    throw new Error("Configuração do Knex não encontrada. Verifique NODE_ENV");
};

logger.info({
    event: "CONNECTION",
    resource: "dynamic_security_controls",
    action: "connection"
}, "Instância do Knex configurada");

const SecuteKnex = require("knex")(knexconfig);

module.exports = SecuteKnex;