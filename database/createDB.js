const environment = process.env.NODE_ENV || "development";
const mysql = require("mysql2/promise");
const logger = require("../config/logger");

async function createDB() {

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
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    await connection.end();

    console.log("Database criado se não existir");

    logger.info({
        event: "CREATE_DATABASE",
        resource: "database",
        action: "create"
    }, "Database criado se não existir");
}

module.exports = createDB;