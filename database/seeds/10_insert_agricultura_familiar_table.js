/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("AGRICULTURA_FAMILIAR").del();

  await knex("AGRICULTURA_FAMILIAR").insert([
    {ID_ASSOCIADO: "1", ID_PROGRAMA: "1", DAP: "DAP001"},
    {ID_ASSOCIADO: "2", ID_PROGRAMA: "2", DAP: "DAP002"},
    {ID_ASSOCIADO: "3", ID_PROGRAMA: "3", DAP: "DAP003"},
    {ID_ASSOCIADO: "4", ID_PROGRAMA: "4", DAP: "DAP004"},
    {ID_ASSOCIADO: "5", ID_PROGRAMA: "5", DAP: "DAP005"},
  ]);
};