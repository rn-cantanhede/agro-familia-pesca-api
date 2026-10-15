const Authorize = require("../../../middleware/Authorize");

describe("Authorize", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            session: {
                user: {
                    id: 1,
                    login: "admin",
                    nivel: 1,
                }
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn(),
            },
        };

        res = {};
        next = jest.fn();
    });

    /*
     * ==========================================================
     * LEVEL
     * ==========================================================
     *
     */
    test("deve permitir usuário com nível suficiente", () => {
        const middleware = Authorize(1);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.log.info).toHaveBeenCalledWith(
            {
                event: "AUTHORIZATION",
                resource: "authorization",
                action: "authorize",
                usuarioId: 1,
            },
            "Usuário autorizado"
        );
    });

    /*
     * ==========================================================
     * LOW LEVEL
     * ==========================================================
     *
     */
    test("deve negar acesso quando o nível do usuário for insuficiente", () => {
        req.session.user.nivel = 2;

        const middleware = Authorize(1);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Sem permissão",
                statusCode: 403,
            })
        );
    });

    /*
     * ==========================================================
     * UNDERFINED
     * ==========================================================
     *
     */
    test("deve negar acesso quando o nível for undefined", () => {
        req.session.user.nivel = undefined;

        const middleware = Authorize(1);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Usuário não autenticado",
                statusCode: 401,
            })
        );
    });
});