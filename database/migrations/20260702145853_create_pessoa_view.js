/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_pessoas AS
    SELECT p.ID, a.ID_PESSOA, p.NOME, p.GENERO, p.CPF, p.DATA_NASCIMENTO, a.CAF, a.VALIDADE_CAF,
           af.DAP, ac.ID AS ID_ASSOCIACAO, ac.NOME AS ASSOCIACAO, sec.ID AS ID_SECRETARIA, 
           sec.NOME AS SECRETARIA
    FROM pessoa p 
    JOIN associado a ON a.ID_PESSOA = p.ID
    JOIN associacao ac ON ac.ID = a.ID_ASSOCIACAO
    JOIN agricultura_familiar af ON af.ID_ASSOCIADO = a.ID
    JOIN secretaria sec ON sec.ID = ac.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_pessoas `);
};
