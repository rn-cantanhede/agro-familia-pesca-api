/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("USUARIO").del();

  await knex("USUARIO").insert([
    {
      ID_PESSOA: "1",
      NIVEL: "1",
      ID_SECRETARIA: "1",
      ID_ASSOCIACAO: "2",
      LOGIN: "admin",
      SENHA: "senha_1"
    },
    {
      ID_PESSOA: "2",
      NIVEL: "2",
      ID_SECRETARIA: "4",
      ID_ASSOCIACAO: "1",
      LOGIN: "maria_pesca",
      SENHA: "senha_2"
    },
    {
      ID_PESSOA: "3",
      NIVEL: "2",
      ID_SECRETARIA: "3",
      ID_ASSOCIACAO: "3",
      LOGIN: "carlos_rural",
      SENHA: "senha_3"
    },
    {
      ID_PESSOA: "4",
      NIVEL: "3",
      ID_SECRETARIA: "5",
      ID_ASSOCIACAO: "4",
      LOGIN: "ana_horta",
      SENHA: "senha_4"
    },
    {
      ID_PESSOA: "5",
      NIVEL: "2",
      ID_SECRETARIA: "1",
      ID_ASSOCIACAO: "5",
      LOGIN: "jose_aquicultura",
      SENHA: "senha_5"
    },
  ]);
};