/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("PESSOA", (table) => {
        table.increments("ID").primary();
        table.string("NOME", 150).notNullable();
        table.string("CPF", 14).unique().notNullable();
        table.specificType("GENERO", "CHAR(1)").notNullable();
        table.date("DATA_NASCIMENTO").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("PESSOA");
};