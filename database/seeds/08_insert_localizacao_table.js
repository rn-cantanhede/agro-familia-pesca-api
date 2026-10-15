/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("LOCALIZACAO_BENEFICIADA").del();

  await knex("LOCALIZACAO_BENEFICIADA").insert([
    {
      ID_ASSOCIADO: "1", 
      LATITUDE: "-2.5300", LONGITUDE: "-44.3000", 
      TITULO: "Sítio Boa Esperança", 
      DESCRICAO: "Área de cultivo de mandioca e criação de peixes"
    },
    {
      ID_ASSOCIADO: "2", 
      LATITUDE: "-2.7500", LONGITUDE: "-42.2700", 
      TITULO: "Praia dos Pescadores", 
      DESCRICAO: "Local de pesca artesanal"
    },
    {
      ID_ASSOCIADO: "3", 
      LATITUDE: "-4.8500", LONGITUDE: "-43.3500", 
      TITULO: "Sítio das Mangueiras", 
      DESCRICAO: "Produção de frutas tropicais"
    },
    {
      ID_ASSOCIADO: "4", 
      LATITUDE: "-5.0500", LONGITUDE: "-45.2000", 
      TITULO: "Horta Verde Vida", 
      DESCRICAO: "Plantio de hortaliças orgânicas"
    },
    {
      ID_ASSOCIADO: "5", 
      LATITUDE: "-3.0500", LONGITUDE: "-44.9500", 
      TITULO: "Fazenda Água Doce", 
      DESCRICAO: "Criação de peixes em tanques"
    },
  ]);
};
