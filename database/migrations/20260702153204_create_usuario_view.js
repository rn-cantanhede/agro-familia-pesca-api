/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_usuarios AS
    SELECT user.ID, pe.ID AS ID_PESSOA, pe.NOME, user.NIVEL, sec.ID AS ID_SECRETARIA, 
           sec.NOME AS SECRETARIA, asso.ID AS ID_ASSOCIACAO, asso.NOME AS ASSOCIACAO, 
           user.LOGIN
    FROM usuario AS user
    JOIN pessoa pe ON pe.ID = user.ID_PESSOA
    JOIN secretaria sec ON sec.ID = user.ID_SECRETARIA
    JOIN associado assoc ON assoc.ID_PESSOA = user.ID_PESSOA
    JOIN associacao asso ON asso.ID = assoc.ID_ASSOCIACAO;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_usuarios `);
};