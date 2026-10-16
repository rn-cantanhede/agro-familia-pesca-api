/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("ASSOCIADO", (table) => {
        table.increments("ID").primary();
        table.integer("ID_PESSOA").unsigned().notNullable;
        table.integer("ID_ASSOCIACAO").unsigned().notNullable;
        table.string("CAF", 50);
        table.date("VALIDADE_CAF");

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
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("ASSOCIADO");
};