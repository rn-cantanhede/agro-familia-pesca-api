/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("PRODUTO").del();

  await knex("PRODUTO").insert([
    {NOME: "Tilápia", ID_TIPO_PRODUTO: 1},
    {NOME: "Camarão Cinza", ID_TIPO_PRODUTO: 2},
    {NOME: "Manga Rosa", ID_TIPO_PRODUTO: 3},
    {NOME: "Alface Crespa", ID_TIPO_PRODUTO: 4},
    {NOME: "Tomate Italiano", ID_TIPO_PRODUTO: 5},
  ]);
};
