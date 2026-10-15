require("dotenv").config();

const app = require("./app");
const logger = require("./config/logger");
const knex = require("./database/connection");
const connectionCheck = require("./database/connectionCheck");
const createDB = require("./database/createDB");

const PORT = process.env.PORT;

/**
 * Inicializa o servidor HTTP somente após
 * validar a conexão com o banco de dados.
 */

(async function startServer() {
    try {
        // Cria o banco caso não exista
        await createDB();

        // Só depois cria a conexão com o Knex
        const knex = require("./database/connection");
        const connectionCheck = require("./database/connectionCheck");

        await connectionCheck(knex);

        // Executa migrations e seeds
        await knex.migrate.latest();

        const CheckInsert = await knex("TIPO_PRODUTO").first();

        if (!CheckInsert) {
            logger.info({
                event: "INSERT_DATABASE",
                resource: "database",
                action: "insert"
            }, "Inserindo dados no database");

            console.log("Inserindo dados no database");
            await knex.seed.run();
        } else {
            logger.warn({
                event: "INSERT_DATABASE_WARN",
                resource: "database",
                action: "insert"
            }, "Banco já está populado");

            console.log("Banco já está populado");
        };

        app.listen(PORT, () => {
            console.log(`Servidor funcionando na porta: ${PORT}`);
        });

        logger.info({
            event: "LISTEN",
            resource: "server",
            action: "listen"
        }, `Servidor funcionando na porta: ${PORT}`);

    } catch (error) {
        logger.error({
            event: "LISTEN_ERROR",
            resource: "server",
            action: "listen"
        }, "Erro ao iniciar servidor");

        console.error("Erro ao iniciar servidor");
        console.error(error);
        process.exit(1);
    }
})();