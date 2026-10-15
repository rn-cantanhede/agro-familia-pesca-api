const pino = require("pino");

const logger = pino({
    level: process.env.LOG_LEVEL || "info",

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "req.headers['x-api-key']"
        ],
        censor: "[REDACTED]"
    },

    transport: {
        targets: [
            {
                target: "pino/file",
                options: {
                    destination: "./logs/app.log",
                    mkdir: true
                }
            },

            {
                target: "pino/file",
                level: "error",
                options: {
                    destination: "./logs/error.log",
                    mkdir: true
                }
            }
        ]
    }
});

module.exports = logger;