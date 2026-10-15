/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("SECRETARIA").del();

  await knex("SECRETARIA").insert([
    {
      NOME: "Secretaria de Agricultura e Pesca", 
      CIDADE: "São Luís", 
      ESTADO: "MA", 
      ENDERECO: "Av. dos Holandeses, 1200"},
    {
      NOME: "Secretaria de Meio Ambiente", 
      CIDADE: "Imperatriz", 
      ESTADO: "MA", 
      ENDERECO: "Rua do Sol, 345"},
    {
      NOME: "Secretaria de Desenvolvimento Rural", 
      CIDADE: "Caxias", 
      ESTADO: "MA", 
      ENDERECO: "Rua Central, 98"},
    {
      NOME: "Secretaria de Pesca Artesanal", 
      CIDADE: "Tutóia", 
      ESTADO: "MA", 
      ENDERECO: "Av. Beira-Mar, 500"},
    {
      NOME: "Secretaria de Produção Sustentável", 
      CIDADE: "Pinheiro", 
      ESTADO: "MA", 
      ENDERECO: "Rua da Matriz, 77"},
  ]);
};
