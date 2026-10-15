/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("ASSOCIACAO", (table) => {
        table.increments("ID").primary();
        table.string("NOME", 150).notNullable();
        table.string("ENDERECO", 255);
        table.integer("ID_CATEGORIA").unsigned(); 
        table.integer("ID_SECRETARIA").unsigned(); 

        table
            .foreign("ID_CATEGORIA")
            .references("ID")
            .inTable("CATEGORIA")
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
    return knex.schema.dropTable("ASSOCIACAO");
};