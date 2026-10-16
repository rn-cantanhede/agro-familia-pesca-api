/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_localizacao_beneficiado AS
    SELECT loc.ID, ps.ID AS ID_PESSOA, ps.NOME, loc.LATITUDE, 
           loc.LONGITUDE, loc.TITULO, loc.DESCRICAO, asso.ID AS ID_ASSOCIACAO, assoc.NOME AS ASSOCIACAO,
           sec.ID AS ID_SECRETARIA, sec.NOME AS SECRETARIA
    FROM localizacao_beneficiada loc
    JOIN associado asso ON asso.ID_PESSOA = loc.ID_ASSOCIADO
    JOIN pessoa ps ON ps.ID = asso.ID_PESSOA
    JOIN associacao assoc ON assoc.ID = asso.ID_ASSOCIACAO
    JOIN secretaria sec ON sec.ID = assoc.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_localizacao_beneficiado `);
};