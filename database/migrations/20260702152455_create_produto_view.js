/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_produtos AS
    SELECT pro.ID, pro.NOME, tipro.NOME AS TIPO_DO_PRODUTO
    FROM produto pro
    JOIN tipo_produto tipro ON tipro.ID = pro.ID_TIPO_PRODUTO;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_produtos `);
};