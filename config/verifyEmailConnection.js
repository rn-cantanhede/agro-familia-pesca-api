const logger = require("./logger");
const emailConfig = require("./emailConfig");

async function verifyEmailConnection() {
    try {
        await emailConfig.verify();

        logger.info({
            event: "CONNECTION_EMAIL",
            resource: "email",
            action: "connection"
        }, "Conexão SMTP estabelecida");

        console.log("Conexão SMTP estabelecida");
    } catch (error) {
        logger.error({
            event: "CONNECTION_EMAIL_ERROR",
            resource: "email",
            action: "connection"
        }, "Falha na conexão SMTP");

        console.error("Falha na conexão SMTP:", error);
    };
};

module.exports = verifyEmailConnection;