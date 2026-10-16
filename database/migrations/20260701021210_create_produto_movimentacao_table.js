/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("PRODUTO_MOVIMENTACAO", (table) => {
        table.increments("ID").primary();
        table.integer("ID_LOCAL").unsigned();
        table.integer("ID_AGRICULTURA_FAMILIAR").unsigned();
        table.integer("ID_PRODUTO").unsigned();
        table.integer("QNT_PRODUZIDA");
        table.decimal("VLR_UNITARIO", 15, 2);
        table.date("DATA_MOVIMENTACAO");

        table
            .foreign("ID_LOCAL")
            .references("ID")
            .inTable("LOCALIZACAO_BENEFICIADA")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_AGRICULTURA_FAMILIAR")
            .references("ID")
            .inTable("AGRICULTURA_FAMILIAR")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("ID_PRODUTO")
            .references("ID")
            .inTable("PRODUTO")
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("PRODUTO_MOVIMENTACAO");
};