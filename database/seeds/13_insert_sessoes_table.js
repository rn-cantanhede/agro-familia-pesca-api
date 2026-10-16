/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("SESSOES").del()
  await knex("SESSOES").insert([
    {
      ID_PESSOA: 1,
      ID_SECRETARIA: 1,
      ID_ASSOCIACAO: 2,
      REFRESH_TOKEN_HASH: "$2b$10$exemplo-do-hash-do-refresh-token",
      CRIADO: knex.fn.now(),
      EXPIRA: knex.raw("DATE_ADD(NOW(), INTERVAL 7 DAY)"),
      IP: "192.168.1.100",
    },
    {
      ID_PESSOA: 2,
      ID_SECRETARIA: 4,
      ID_ASSOCIACAO: 1,
      REFRESH_TOKEN_HASH: "$2b$10$exemplo-do-hash-do-refresh-token",
      CRIADO: knex.fn.now(),
      EXPIRA: knex.raw("DATE_ADD(NOW(), INTERVAL 7 DAY)"),
      IP: "192.168.1.100",
    },
    {
      ID_PESSOA: 3,
      ID_SECRETARIA: 3,
      ID_ASSOCIACAO: 3,
      REFRESH_TOKEN_HASH: "$2b$10$exemplo-do-hash-do-refresh-token",
      CRIADO: knex.fn.now(),
      EXPIRA: knex.raw("DATE_ADD(NOW(), INTERVAL 7 DAY)"),
      IP: "192.168.1.100",
    },
    {
      ID_PESSOA: 4,
      ID_SECRETARIA: 5,
      ID_ASSOCIACAO: 4,
      REFRESH_TOKEN_HASH: "$2b$10$exemplo-do-hash-do-refresh-token",
      CRIADO: knex.fn.now(),
      EXPIRA: knex.raw("DATE_ADD(NOW(), INTERVAL 7 DAY)"),
      IP: "192.168.1.100",
    },
    {
      ID_PESSOA: 5,
      ID_SECRETARIA: 1,
      ID_ASSOCIACAO: 5,
      REFRESH_TOKEN_HASH: "$2b$10$exemplo-do-hash-do-refresh-token",
      CRIADO: knex.fn.now(),
      EXPIRA: knex.raw("DATE_ADD(NOW(), INTERVAL 7 DAY)"),
      IP: "192.168.1.100",
    },
  ]);
};
