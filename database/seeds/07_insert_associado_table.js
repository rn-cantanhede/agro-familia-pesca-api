/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("ASSOCIADO").del();

  await knex("ASSOCIADO").insert([
    {ID_PESSOA: "1", ID_ASSOCIACAO: "2", CAF: "CAF12345", VALIDADE_CAF: "2026-01-01"},
    {ID_PESSOA: "2", ID_ASSOCIACAO: "1", CAF: "CAF67890", VALIDADE_CAF: "2025-12-31"},
    {ID_PESSOA: "3", ID_ASSOCIACAO: "3", CAF: "CAF54321", VALIDADE_CAF: "2026-03-15"},
    {ID_PESSOA: "4", ID_ASSOCIACAO: "4", CAF: "CAF98765", VALIDADE_CAF: "2026-05-20"},
    {ID_PESSOA: "5", ID_ASSOCIACAO: "5", CAF: "CAF24680", VALIDADE_CAF: "2025-10-10"},
  ]);
};
