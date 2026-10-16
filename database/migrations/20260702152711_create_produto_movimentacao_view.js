/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE OR REPLACE VIEW view_produto_movimentacao AS
    SELECT movi.ID, agri.DAP, pro.NOME AS PRODUTO, movi.QNT_PRODUZIDA, 
           movi.VLR_UNITARIO, movi.DATA_MOVIMENTACAO, loca.LATITUDE, loca.LONGITUDE,
           pe.ID AS ID_PESSOA, agri.ID_ASSOCIADO, pe.NOME, assoc.ID  AS ID_ASSOCIACAO, 
           assoc.NOME AS ASSOCIACAO, sec.ID AS ID_SECRETARIA, sec.NOME AS SECRETARIA
    FROM produto_movimentacao movi
    JOIN agricultura_familiar agri ON agri.ID = movi.ID_AGRICULTURA_FAMILIAR
    JOIN produto pro ON pro.ID = movi.ID_PRODUTO
    JOIN localizacao_beneficiada loca ON loca.ID = movi.ID_LOCAL
    JOIN associado asso ON asso.ID_PESSOA = agri.ID_ASSOCIADO
    JOIN pessoa pe ON pe.ID = asso.ID_PESSOA
    JOIN associacao assoc ON assoc.ID = asso.ID_ASSOCIACAO
    JOIN secretaria sec ON sec.ID = assoc.ID_SECRETARIA;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(` DROP VIEW view_produto_movimentacao `);
};