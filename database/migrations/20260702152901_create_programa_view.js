/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_programas AS
    SELECT prog.ID, prog.NOME, prog.DESCRICAO, prog.DATA_INICIO, prog.DATA_FIM,
           prog.ORIGEM_RECURSO, prog.VLR_REPASSE, prog.ID_SECRETARIA, sec.NOME AS SECRETARIA, 
           prog.ID_ASSOCIACAO, asso.NOME AS ASSOCIACAO, sec.ESTADO
    FROM programa prog
    JOIN associacao asso ON asso.ID = prog.ID_ASSOCIACAO
    JOIN secretaria sec ON sec.ID = prog.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_programas `);
};