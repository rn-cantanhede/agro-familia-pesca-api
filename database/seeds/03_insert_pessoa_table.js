/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("PESSOA").del();

  await knex("PESSOA").insert([
    {NOME: "João da Silva", CPF: "111.111.111-11", GENERO: "M", DATA_NASCIMENTO: "1980-03-15"},
    {NOME: "Maria Oliveira", CPF: "222.222.222-22", GENERO: "F", DATA_NASCIMENTO: "1985-07-10"},
    {NOME: "Carlos Santos", CPF: "333.333.333-33", GENERO: "M", DATA_NASCIMENTO: "1990-12-25"},
    {NOME: "Ana Souza", CPF: "444.444.444-44", GENERO: "F", DATA_NASCIMENTO: "1995-05-05"},
    {NOME: "José Pereira", CPF: "555.555.555-55", GENERO: "M", DATA_NASCIMENTO: "1988-09-22"},
  ]);
};
