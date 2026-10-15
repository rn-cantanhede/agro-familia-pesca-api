const environment = process.env.NODE_ENV || "development";

/**
 * Configurações de conexão com o banco de dados
 * organizadas por ambiente de execução.
 */

const configs = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            timezone: "-03:00",
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: "./database/migrations"
        },
        seeds: {
            directory: "./database/seeds"
        },
    },

    development_ifma: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: "",
            database: process.env.DB_NAME,
            timezone: "-03:00",
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

module.exports = configs[environment];