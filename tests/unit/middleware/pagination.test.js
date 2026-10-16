const pagination = require("../../../middleware/pagination");

describe("pagination", () => {
    beforeEach(() => {
        req = {
            query: {
                page: 1,
                limit: 10
            }
        };

        res = {};
        next = jest.fn();
    });

    /*
     * ==========================================================
     * NEXT
     * ==========================================================
     *
     */

    test("deve funcionar normalmente", () => {
        pagination(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.pagination).toEqual({
            page: 1,
            limit: 10,
            offset: 0
        });
    });

    /*
     * ==========================================================
     * PAGE < 0
     * ==========================================================
     *
     */
    test("deve ser um inteiro maior ou igual a 1", () => {
        req.query.page = 0;

        expect(() => pagination(req, res, next)).toThrow(
            "O parâmetro 'page' deve ser um inteiro maior ou igual a 1"
        );

        expect(next).not.toHaveBeenCalled();
    });

    /*
     * ==========================================================
     * LIMIT > 100
     * ==========================================================
     *
     */
    test("deve ser um inteiro entre 1 e 100", () => {
        req.query.limit = 200;

        expect(() => pagination(req, res, next)).toThrow(
            "O parâmetro 'limit' deve ser um inteiro entre 1 e 100"
        );

        expect(next).not.toHaveBeenCalled();
    });
});
