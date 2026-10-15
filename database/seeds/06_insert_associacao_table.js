/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("ASSOCIACAO").del();

  await knex("ASSOCIACAO").insert([
    {
      NOME: "Associação dos Pescadores de Tutóia", 
      ENDERECO: "Rua dos Pescadores, 101", 
      ID_CATEGORIA: "2", ID_SECRETARIA: "4"
    },
    {
      NOME: "Cooperativa da Agricultura Familiar de Caxias", 
      ENDERECO: "Rua Verde, 12", 
      ID_CATEGORIA: "1", ID_SECRETARIA: "3"
    },
    {
      NOME: "Associação dos Fruticultores do Maranhão", 
      ENDERECO: "Rua das Mangueiras, 50", 
      ID_CATEGORIA: "4", ID_SECRETARIA: "1"
    },
    {
      NOME: "Associação de Hortaliças Sustentáveis", 
      ENDERECO: "Av. Rural, 40", 
      ID_CATEGORIA: "3", ID_SECRETARIA: "5"
    },
    {
      NOME: "Associação dos Aquicultores do Norte", 
      ENDERECO: "Travessa Azul, 7", 
      ID_CATEGORIA: "5", ID_SECRETARIA: "1"
    },
  ]);
};
