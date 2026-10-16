/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("SECRETARIA", (table) => {
        table.increments("ID").primary();
        table.string("NOME", 150).notNullable();
        table.string("CIDADE", 150);
        table.specificType("ESTADO", "CHAR(2)");
        table.string("ENDERECO", 255);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("SECRETARIA");
};