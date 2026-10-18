const rateLimiter = require("express-rate-limit");
const logger = require("../config/logger");
const secureLogger = require("../config/secureLogger");
// const { createClient } = require("redis");
// const { RedisStore } = require("rate-limit-redis");

/**
 * Aplica o rate limiter na API com no máximo de 100 requisições
 * Retorna os headers informando o limite e não usa os antigos
 */

/**
 * Configuração do Redis para armazenamento do rate-limit.
 * Mantém o rate-limit fora da aplicação e permite compartilhá-los entre instâncias.
 * Requer um Redis Server em execução e a variável REDIS_URL configurada.
 */

/**
 * Redis opcional.

Para utilizar Redis, é necessário ter um Redis Server executando localmente.

Após iniciar o Redis em qualquer ambiente:

  REDIS_URL=redis://localhost:6379

Depois:
  1. Configure REDIS_URL no .env.
  2. Descomente a configuração do Redis abaixo e store.
  3. Inicie a aplicação.

Observação:
O pacote "redis" é apenas o cliente Redis para Node.js.
Ele NÃO instala o Redis Server.
 */

// const redisClient = createClient({
//     url: process.env.REDIS || "redis://localhost:6379"
// });

// redisClient.on("error", (erro) => {
//     logger.error(erro, "Erro na conexão com Redis");
// });

// redisClient.connect();

const apiLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 100,
    message: {
        error: "Muitas tentativas de login. Tente novamente mais tarde",
    },

    message: () => {
        logger.warn({
            event: "RATE_LIMITER",
            resource: "authentication",
            action: "login"
        }, "Muitas tentativas de login. Tente novamente mais tarde");

        secureLogger.warn({
            event: "RATE_LIMITER",
            resource: "authentication",
            action: "login"
        }, "Muitas tentativas de login. Tente novamente mais tarde");

        console.log("Muitas tentativas de login. Tente novamente mais tarde.");

        return {
            error: "Muitas tentativas de login. Tente novamente mais tarde"
        };
    },

    standardHeaders: "draft-8",
    legacyHeaders: false,

    // store: new RedisStore({
    //     sendCommand: (...limit) => redisClient.sendCommand(limit),
    //     prefix: 'rate-limit:'
    // }),
});

module.exports = apiLimiter;