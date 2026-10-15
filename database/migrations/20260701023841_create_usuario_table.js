/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("USUARIO", (table) => {
        table.increments("ID").primary();
        table.integer("ID_PESSOA").unsigned().notNullable();
        table.integer("ID_SECRETARIA").unsigned();
        table.integer("ID_ASSOCIACAO").unsigned();
        table.integer("NIVEL");
        table.string("LOGIN", 50).unique().notNullable();
        table.string("SENHA", 255).notNullable();

        table
            .foreign("ID_PESSOA")
            .references("ID")
            .inTable("PESSOA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_ASSOCIACAO")
            .references("ID")
            .inTable("ASSOCIACAO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_SECRETARIA")
            .references("ID")
            .inTable("SECRETARIA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("USUARIO");
};