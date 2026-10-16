/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("AGRICULTURA_FAMILIAR", (table) => {
        table.increments("ID").primary();
        table.integer("ID_ASSOCIADO").unsigned().notNullable();
        table.integer("ID_PROGRAMA").unsigned();
        table.string("DAP", 50);

        table
            .foreign("ID_ASSOCIADO")
            .references("ID")
            .inTable("ASSOCIADO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_PROGRAMA")
            .references("ID")
            .inTable("PROGRAMA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("AGRICULTURA_FAMILIAR");
};