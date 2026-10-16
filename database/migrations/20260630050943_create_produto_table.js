/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("PRODUTO", (table) => {
        table.increments("ID").primary();
        table.string("NOME", 150).notNullable();
        table.integer("ID_TIPO_PRODUTO").unsigned();

        table
            .foreign("ID_TIPO_PRODUTO")
            .references("ID")
            .inTable("TIPO_PRODUTO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("PRODUTO");
};