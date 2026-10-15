/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_associados AS
    SELECT a.ID, a.ID_PESSOA, a.CAF, a.VALIDADE_CAF, 
           ac.ID AS ID_ASSOCIACAO, ac.NOME AS ASSOCIACAO, 
           sec.ID AS ID_SECRETARIA, sec.NOME AS SECRETARIA
    FROM associado a
    JOIN associacao ac ON ac.ID = a.ID_ASSOCIACAO
    JOIN secretaria sec ON sec.ID = ac.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_associados `);
};