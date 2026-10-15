/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_agricultura_familiar AS
    SELECT agri.ID, asso.ID AS ID_ASSOCIADO, pe.ID AS ID_PESSOA, pe.NOME, 
           asso.CAF, prog.NOME AS PROGRAMA, agri.DAP, assoc.ID AS ID_ASSOCIACAO, 
           assoc.NOME AS ASSOCIACAO, sec.ID AS ID_SECRETARIA, sec.NOME AS SECRETARIA
    FROM agricultura_familiar agri
    JOIN associado asso ON asso.ID = agri.ID_ASSOCIADO
    JOIN pessoa pe ON asso.ID_PESSOA = pe.ID
    JOIN programa prog ON prog.ID = agri.ID_PROGRAMA
    JOIN associacao assoc ON assoc.ID = asso.ID_ASSOCIACAO
    JOIN secretaria sec ON sec.ID = assoc.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_agricultura_familiar `);
};