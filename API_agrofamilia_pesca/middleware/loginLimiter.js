const rateLimiter = require("express-rate-limit");
const logger = require("../config/logger");
const secureLogger = require("../config/secureLogger");
const { createClient } = require("redis");
const { RedisStore } = require("rate-limit-redis");

/**
 * Aplica o rate limiter com no máximo de 5 requisições
 * Retorna os headers informando o limite e não usa os antigos
 */
const redisClient = createClient({
    url: process.env.REDIS || "redis://localhost:6379"
});

redisClient.on("error", (erro) => {
    logger.error(erro, "Erro na conexão com Redis");
});

redisClient.connect();

const loginLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
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

    store: new RedisStore({
        sendCommand: (...limit) => redisClient.sendCommand(limit),
        prefix: 'rate-limit:'
    }),
});

module.exports = loginLimiter;