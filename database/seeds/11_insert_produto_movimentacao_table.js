/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("PRODUTO_MOVIMENTACAO").del();

  await knex("PRODUTO_MOVIMENTACAO").insert([
    {
      ID_LOCAL: "1", 
      ID_AGRICULTURA_FAMILIAR: "1", 
      ID_PRODUTO: "1",
      QNT_PRODUZIDA: "200",
      VLR_UNITARIO: "15.50",
      DATA_MOVIMENTACAO: "2025-01-10",
    },
    {
      ID_LOCAL: "2", 
      ID_AGRICULTURA_FAMILIAR: "2", 
      ID_PRODUTO: "2",
      QNT_PRODUZIDA: "100",
      VLR_UNITARIO: "25.00",
      DATA_MOVIMENTACAO: "2025-02-12",
    },
    {
      ID_LOCAL: "3", 
      ID_AGRICULTURA_FAMILIAR: "3", 
      ID_PRODUTO: "3",
      QNT_PRODUZIDA: "300",
      VLR_UNITARIO: "5.50",
      DATA_MOVIMENTACAO: "2025-03-08",
    },
    {
      ID_LOCAL: "4", 
      ID_AGRICULTURA_FAMILIAR: "4", 
      ID_PRODUTO: "4",
      QNT_PRODUZIDA: "150",
      VLR_UNITARIO: "3.20",
      DATA_MOVIMENTACAO: "2025-04-15",
    },
    {
      ID_LOCAL: "5", 
      ID_AGRICULTURA_FAMILIAR: "5", 
      ID_PRODUTO: "5",
      QNT_PRODUZIDA: "400",
      VLR_UNITARIO: "4.75",
      DATA_MOVIMENTACAO: "2025-05-05",
    },
  ]);
};