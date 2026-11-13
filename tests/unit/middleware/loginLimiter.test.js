const express = require("express");
const request = require("supertest");

jest.mock("../../../config/logger", () => ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock("../../../config/secureLogger", () => ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
}));

describe("loginLimiter", () => {
    let app;
    let loginLimiter;
    let logger;
    let secureLogger;

    const mensagem = "Muitas tentativas de login. Tente novamente mais tarde";

    beforeEach(() => {
        jest.resetModules();

        // Importa os mocks da nova instância dos módulos
        logger = require("../../../config/logger");
        secureLogger = require("../../../config/secureLogger");

        // Importa uma nova instância do limiter
        loginLimiter = require("../../../middleware/loginLimiter");

        jest.clearAllMocks();

        app = express();

        app.use(express.json());
        app.use(loginLimiter);

        app.post("/login", (req, res) => {
            res.status(200).json({
                success: true,
            });
        });
    });

    /*
     * ==========================================================
     * TRUE
     * ==========================================================
     */

    test("deve permitir até 5 requisições", async () => {
        for (let i = 1; i <= 5; i++) {
            const result = await request(app)
                .post("/login")
                .send({ LOGIN: "usuario" });

            expect(result.status).toBe(200);
        }
    });

    /*
     * ==========================================================
     * BLOCK
     * ==========================================================
     */

    test("deve bloquear a 6ª requisição", async () => {
        for (let i = 1; i <= 5; i++) {
            await request(app)
                .post("/login")
                .send({ LOGIN: "usuario" });
        }

        const result = await request(app)
            .post("/login")
            .send({ LOGIN: "usuario" });

        expect(result.status).toBe(429);

        expect(result.body).toEqual({
            error: mensagem,
        });
    });

    /*
     * ==========================================================
     * HEADERS
     * ==========================================================
     */

    test("deve enviar os headers de rate limit", async () => {
        const result = await request(app)
            .post("/login")
            .send({ LOGIN: "usuario" });

        expect(result.status).toBe(200);

        expect(result.headers).toHaveProperty("ratelimit");

        expect(result.headers).not.toHaveProperty("x-ratelimit-limit");
        expect(result.headers).not.toHaveProperty("x-ratelimit-remaining");
    });

    /*
     * ==========================================================
     * LOGS
     * ==========================================================
     */

    test("deve registrar o bloqueio no logger da aplicação", async () => {
        for (let i = 0; i < 6; i++) {
            await request(app)
                .post("/login")
                .send({ LOGIN: "usuario" });
        }

        expect(logger.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "RATE_LIMITER",
                resource: "authentication",
                action: "login",
                userLogin: "usuario",
            }),
            mensagem
        );
    });

    test("deve registrar o bloqueio no secureLogger", async () => {
        for (let i = 0; i < 6; i++) {
            await request(app)
                .post("/login")
                .send({ LOGIN: "usuario" });
        }

        expect(secureLogger.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "RATE_LIMITER",
                resource: "authentication",
                action: "login",
                userLogin: "usuario",
            }),
            mensagem
        );
    });

    /*
     * ==========================================================
     * BODY
     * ==========================================================
     */

    test("deve bloquear mesmo quando o LOGIN não estiver presente", async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).post("/login");
        }

        const result = await request(app).post("/login");

        expect(result.status).toBe(429);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "RATE_LIMITER",
                userLogin: undefined,
            }),
            mensagem
        );
    });
});