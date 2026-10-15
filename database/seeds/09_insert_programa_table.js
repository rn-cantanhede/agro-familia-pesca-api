/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("PROGRAMA").del();

  await knex("PROGRAMA").insert([
    {
      NOME: "Programa de Apoio à Agricultura Familiar", 
      DESCRICAO: "Incentivo à produção local", 
      DATA_INICIO: "2024-01-01", 
      DATA_FIM: "2026-12-31",
      ORIGEM_RECURSO: "Governo Estadual",
      VLR_REPASSE: 150000.00,
      ID_SECRETARIA: 1,
      ID_ASSOCIACAO: 3
    },
    {
      NOME: "Projeto Pescar Mais", 
      DESCRICAO: "Apoio à pesca artesanal", 
      DATA_INICIO: "2023-05-01", 
      DATA_FIM: "2025-05-01",
      ORIGEM_RECURSO: "Governo Federal",
      VLR_REPASSE: 200000.00,
      ID_SECRETARIA: 4,
      ID_ASSOCIACAO: 1
    },
    {
      NOME: "Programa Fruta Boa", 
      DESCRICAO: "Fomento à fruticultura regional", 
      DATA_INICIO: "2024-06-01", 
      DATA_FIM: "2027-06-01",
      ORIGEM_RECURSO: "Parceria Público-Privada",
      VLR_REPASSE: 120000.00,
      ID_SECRETARIA: 1,
      ID_ASSOCIACAO: 5
    },
    {
      NOME: "Horta Viva", 
      DESCRICAO: "Capacitação de horticultores", 
      DATA_INICIO: "2024-03-10", 
      DATA_FIM: "2026-03-10",
      ORIGEM_RECURSO: "Prefeitura de Pinheiro",
      VLR_REPASSE: 90000.00,
      ID_SECRETARIA: 5,
      ID_ASSOCIACAO: 4
    },
    {
      NOME: "Aquicultura Sustentável", 
      DESCRICAO: "Desenvolvimento da aquicultura", 
      DATA_INICIO: "2023-11-01", 
      DATA_FIM: "2026-11-01",
      ORIGEM_RECURSO: "Banco do Nordeste",
      VLR_REPASSE: 175000.00,
      ID_SECRETARIA: 3,
      ID_ASSOCIACAO: 2
    },
  ]);
};
