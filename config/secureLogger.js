const pino = require("pino");

const secureLogger = pino({
    level: process.env.LOG_LEVEL || "info",

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "req.headers.x-api-key"
        ],
        censor: "[REDACTED]"
    },

    transport: {
        targets: [
            {
                target: "pino/file",
                options: {
                    destination: "./logs/secure.log",
                    mkdir: true
                }
            },
        ]
    }
});

module.exports = secureLogger;