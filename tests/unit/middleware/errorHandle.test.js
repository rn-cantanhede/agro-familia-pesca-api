const errorHandle = require("../../../middleware/errorHandle");
const Erros = require("../../../shared/errors/Errors");

describe("errorHandle", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        next = jest.fn();

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    /*
     * ==========================================================
     * 404
     * ==========================================================
     *
     */

    test("deve retornar o status e a mensagem de um erro customizado", () => {
        const err = new Erros("Not found", 404);

        errorHandle(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Not found"
        });
    });

    /*
     * ==========================================================
     * 500
     * ==========================================================
     *
     */

    test("deve retornar status 500 para erros inesperados", () => {
        const err = new Error("Erro interno no servidor", 500);

        errorHandle(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Erro interno no servidor"
        });
    });
});
