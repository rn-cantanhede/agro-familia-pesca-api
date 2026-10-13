const express = require("express");
const request = require("supertest");

jest.mock("../../../config/logger", () => ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
}));

const mockRedisClient = {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    sendCommand: jest.fn(),
};

jest.mock("redis", () => ({
    createClient: jest.fn(() => mockRedisClient),
}));

// Contador em memória para simular o Redis
const mockHits = new Map();
const mockResetTimes = new Map();

jest.mock("rate-limit-redis", () => ({
    RedisStore: jest.fn().mockImplementation(() => ({
        init: jest.fn(),

        increment: jest.fn(async (key) => {
            const now = Date.now();
            let resetTime = mockResetTimes.get(key);

            if (!resetTime || resetTime.getTime() <= now) {
                resetTime = new Date(now + 15 * 60 * 1000);
                mockResetTimes.set(key, resetTime);
                mockHits.set(key, 0);
            }

            const totalHits = (mockHits.get(key) || 0) + 1;
            mockHits.set(key, totalHits);

            return {
                totalHits,
                resetTime,
            };
        }),

        decrement: jest.fn(async (key) => {
            const totalHits = mockHits.get(key) || 0;
            mockHits.set(key, Math.max(0, totalHits - 1));
        }),

        resetKey: jest.fn(async (key) => {
            mockHits.delete(key);
            mockResetTimes.delete(key);
        }),
    })),
}));

const loginLimiter = require("../../../middleware/loginLimiter");

describe("loginLimiter", () => {
    let app;

    beforeEach(() => {
        // Isola os testes para que um não afete o outro
        mockHits.clear();
        mockResetTimes.clear();

        app = express();

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
     *
     */
    test("deve permitir até 5 requisições", async () => {
        for (let i = 1; i <= 5; i++) {
            const result = await request(app).post("/login");

            expect(result.status).toBe(200);
        }
    });

    /*
     * ==========================================================
     * BLOCK
     * ==========================================================
     *
     */
    test("deve bloquear a 6ª requisição", async () => {
        for (let i = 1; i <= 5; i++) {
            await request(app).post("/login");
        }

        const result = await request(app).post("/login");

        expect(result.status).toBe(429);

        expect(result.body).toEqual({
            error: "Muitas tentativas de login. Tente novamente mais tarde",
        });
    });

    /*
     * ==========================================================
     * HEADERS
     * ==========================================================
     *
     */
    test("deve enviar os headers de rate limit", async () => {
        const result = await request(app).post("/login");

        expect(result.status).toBe(200);
        expect(result.headers).toHaveProperty("ratelimit");
        expect(result.headers).not.toHaveProperty("x-ratelimit-limit");
        expect(result.headers).not.toHaveProperty("x-ratelimit-remaining");
    });
});