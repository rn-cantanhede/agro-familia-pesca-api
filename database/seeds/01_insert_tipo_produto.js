/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("TIPO_PRODUTO").del()

  await knex("TIPO_PRODUTO").insert([
    {NOME: "Peixe"},
    {NOME: "Crustáceo"},
    {NOME: "Fruta"},
    {NOME: "Verdura"},
    {NOME: "Legume"},
  ]);
};
