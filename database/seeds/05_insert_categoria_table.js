/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("CATEGORIA").del();

  await knex("CATEGORIA").insert([
    {NOME: "Agricultura Familiar"},
    {NOME: "Pesca Artesanal"},
    {NOME: "Horticultura"},
    {NOME: "Fruticultura"},
    {NOME: "Aquicultura"},
  ]);
};
