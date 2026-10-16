/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("LOCALIZACAO_BENEFICIADA", (table) => {
        table.increments("ID").primary();
        table.integer("ID_ASSOCIADO").unsigned().notNullable;
        table.double("LATITUDE");
        table.double("LONGITUDE");
        table.string("TITULO", 100);
        table.string("DESCRICAO", 255);

        table
            .foreign("ID_ASSOCIADO")
            .references("ID")
            .inTable("ASSOCIADO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("LOCALIZACAO_BENEFICIADA");
};