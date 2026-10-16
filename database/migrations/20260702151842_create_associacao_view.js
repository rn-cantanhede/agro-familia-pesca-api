/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_associacoes AS
    SELECT ac.ID, ac.NOME, cat.NOME AS CATEGORIA, sec.ID AS ID_SECRETARIA, sec.NOME AS SECRETARIA
    FROM associacao ac
    JOIN categoria cat ON cat.ID = ac.ID_CATEGORIA
    JOIN secretaria sec ON sec.ID = ac.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_associacoes `);
};