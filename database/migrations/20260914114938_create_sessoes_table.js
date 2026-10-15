/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("SESSOES", (table) => {
        table.increments("ID").primary();
        table.integer("ID_PESSOA").unsigned().notNullable();
        table.integer("ID_SECRETARIA").unsigned();
        table.integer("ID_ASSOCIACAO").unsigned();

        table.string("REFRESH_TOKEN_HASH").notNullable();
        table.dateTime("CRIADO").notNullable();
        table.dateTime("USADO");
        table.dateTime("EXPIRA").notNullable();
        table.dateTime("REVOGADO");
        table.string("IP");

        table
            .foreign("ID_PESSOA")
            .references("ID")
            .inTable("PESSOA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_SECRETARIA")
            .references("ID")
            .inTable("SECRETARIA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_ASSOCIACAO")
            .references("ID")
            .inTable("ASSOCIACAO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("SESSOES");
};
