const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,      // Porta segura para SSL/TLS (ou 587 para STARTTLS com secure: false)
        secure: process.env.SMTP_SECURE,   // true para porta 465, false para outras portas
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });