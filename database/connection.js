const knexconfig = require("../config/knex");
const logger = require("../config/logger");
/**
 * Instância única do Knex configurada para acesso ao banco de dados.
 */

if (!knexconfig) {
    logger.error({
        event: "CONNECTION_ERROR",
        resource: "database",
        action: "connection"
    }, "Configuração do Knex não encontrada. Verifique NODE_ENV");

    throw new Error("Configuração do Knex não encontrada. Verifique NODE_ENV");
};

logger.info({
    event: "CONNECTION",
    resource: "database",
    action: "connection"
}, "Instância do Knex configurada");

const knex = require("knex")(knexconfig);

module.exports = knex;