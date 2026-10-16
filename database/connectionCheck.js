const logger = require("../config/logger");

/**
 * Verifica conexão com o database.
 * Caso falhe, a aplicação é encerrada imediatamente.
 */
async function connectionCheck(knex) {
    if (!knex) {
        logger.error({
            event: "CONNECTION_ERROR",
            resource: "database",
            action: "connection"
        }, "Instância do Knex não foi fornecida");

        throw new Error("Instância do Knex não foi fornecida");
    }

    await knex.raw("SELECT 1");
    console.log("Conexão com o banco de dados estabelecida");

    logger.info({
        event: "CONNECTION",
        resource: "database",
        action: "connection"
    }, "Conexão com o banco de dados estabelecida");
};

module.exports = connectionCheck;