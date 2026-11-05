const mysql = require("mysql2/promise");
const logger = require("../../config/logger");
const secureKnex = require("../connectionSecute");

//Importa tabelas
const securityOperators = require("./tables/securityOperators");
const securityControls = require("./tables/securityControls");
const securityEvents = require("./tables/securityEvents");
const securityIncidents = require("./tables/securityIncidents");
const securityAuditLogs = require("./tables/securityAuditLogs");

async function createSecuteDB() {

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    if (!connection) {
        logger.error({
            event: "CREATE_DATABASE_ERROR",
            resource: "database",
            action: "create"
        }, "Erro na conexão para criação do database");

        throw new Error("Erro na conexão para criação do database");
    };

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_SECURE_NAME}`
    );

    logger.info({
        event: "CREATE_DATABASE",
        resource: process.env.DB_SECURE_NAME,
        action: "create"
    }, "Database de segurança criado se não existir");

    console.log("Database de segurança criado se não existir");

    await connection.query(`USE ${process.env.DB_SECURE_NAME}`);

    await connection.end();

    await securityOperators();
    await securityControls();
    await securityEvents();
    await securityIncidents();
    await securityAuditLogs();

    logger.info({
        event: "CREATE_TABLE",
        resource: process.env.DB_SECURE_NAME,
        action: "create"
    }, "Tabelas do database de segurança criadas se não existir");

    console.log("Tabelas do database de segurança criadas se não existir");

    if (await secureKnex.select("name")
        .from("security_events")
        .where("name", "Inicialização do database de segurança") == ""
    ) {
        await secureKnex("security_events").insert([
            {
                name: "Inicialização do database de segurança",
                event_type: "SYSTEM_INITIALIZED",
                severity: "info",
                source_ip: null,
                route: null,
                http_method: null,
                request_id: null,
                details: JSON.stringify({
                    source: "database_seed",
                    message: "Database de segurança inicializado"
                }),
                occurred: new Date()
            }
        ]);
    };
};

module.exports = createSecuteDB;