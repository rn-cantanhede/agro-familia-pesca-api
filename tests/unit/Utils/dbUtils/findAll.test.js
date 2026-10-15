jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    findAll
} = require("../../../../shared/Utils/dbUtils");

describe("findAll", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * RETURN ELEMENTOS
     * =========================================================
     */
    test("deve retornar lista com elementos encontrados", async () => {

        /**
         * Resultado que será devolvido pelo banco.
         */

        const resultMock = [
            {
                id: 1,
                name: "João"
            }
        ];

        /**
         * Mock da última função da cadeia:
         *
         * .offset(...)
         *
         * Ela precisa retornar uma Promise,
         * pois o código utiliza await.
         */

        const offsetMock = jest.fn()
            .mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const fromMock = jest.fn(() => ({
            limit: limitMock
        }));

        /**
         * Montamos a cadeia:
         *
         * knex.select("")
         *     .from(...)
         *     .limit(...)
         *     .offset(...)
         */

        knex.select.mockReturnValue({
            from: fromMock
        });

        /**
         * -------------------------------------------------
         * MOCK DO COUNT
         * -------------------------------------------------
         */

        const countMock = jest.fn()
            .mockResolvedValue([
                { count: 2 }
            ]);

        /**
         * Quando knex("users") for executado,
         * retorna nossa cadeia de count.
         */

        knex.mockReturnValue({
            count: countMock
        });

        /**
         * -------------------------------------------------
         * EXECUÇÃO
         * -------------------------------------------------
         */

        const result = await findAll("users", 1, 2);

        /**
         * -------------------------------------------------
         * VERIFICAÇÕES
         * -------------------------------------------------
         *
         */

        expect(result).toEqual({
            result: [{ id: 1, name: 'João' }],
            total: [{ count: 2 }]
        });

        expect(knex.select).toHaveBeenCalledWith("");

        expect(fromMock).toHaveBeenCalledWith("users");

        expect(limitMock).toHaveBeenCalledWith(2);

        expect(offsetMock).toHaveBeenCalledWith(0);

        expect(knex).toHaveBeenCalledWith("users");
    });

    /**
     * =========================================================
     * PAGINAÇÃO
     * =========================================================
     */
    test("deve retornar lista com elementos encontrados", async () => {

        /**
         * Resultado que será devolvido pelo banco.
         */

        const resultMock = [
            {
                id: 1,
                name: "João"
            },
            {
                id: 2,
                name: "Ana"
            }
        ];

        /**
         * Mock da última função da cadeia:
         *
         * .offset(...)
         *
         * Ela precisa retornar uma Promise,
         * pois o código utiliza await.
         */

        const offsetMock = jest.fn()
            .mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const fromMock = jest.fn(() => ({
            limit: limitMock
        }));

        /**
         * Montamos a cadeia:
         *
         * knex.select("")
         *     .from(...)
         *     .limit(...)
         *     .offset(...)
         */

        knex.select.mockReturnValue({
            from: fromMock
        });

        /**
         * -------------------------------------------------
         * MOCK DO COUNT
         * -------------------------------------------------
         */

        const countMock = jest.fn()
            .mockResolvedValue([
                { count: 2 }
            ]);

        /**
         * Quando knex("users") for executado,
         * retorna nossa cadeia de count.
         */

        knex.mockReturnValue({
            count: countMock
        });

        /**
         * -------------------------------------------------
         * EXECUÇÃO
         * -------------------------------------------------
         */

        const result = await findAll("users", 1, 2);

        /**
         * -------------------------------------------------
         * VERIFICAÇÕES
         * -------------------------------------------------
         *
         */

        expect(result).toEqual({
            result: [{ id: 1, name: 'João' }, { id: 2, name: 'Ana' }],
            total: [{ count: 2 }]
        });

        expect(knex.select).toHaveBeenCalledWith("");

        expect(fromMock).toHaveBeenCalledWith("users");

        expect(limitMock).toHaveBeenCalledWith(2);

        expect(offsetMock).toHaveBeenCalledWith(0);

        expect(knex).toHaveBeenCalledWith("users");
    });

    /**
     * =========================================================
     * NENHUM RESULTADO
     * =========================================================
     */

    test("deve retornar lista vazia quando não encontrar resultados", async () => {
        const offsetMock = jest.fn().mockResolvedValue([]);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const fromMock = jest.fn(() => ({
            limit: limitMock
        }));

        /**
         * Montamos a cadeia:
         *
         * knex.select("")
         *     .from(...)
         *     .limit(...)
         *     .offset(...)
         */

        knex.select.mockReturnValue({
            from: fromMock
        });

        /**
         * -------------------------------------------------
         * MOCK DO COUNT
         * -------------------------------------------------
         */

        const countMock = jest.fn()
            .mockResolvedValue([
                { count: 2 }
            ]);

        /**
         * Quando knex("users") for executado,
         * retorna nossa cadeia de count.
         */

        knex.mockReturnValue({
            count: countMock
        });

        /**
         * -------------------------------------------------
         * EXECUÇÃO
         * -------------------------------------------------
         */

        const result = await findAll("users", 1, 2);

        /**
         * -------------------------------------------------
         * VERIFICAÇÕES
         * -------------------------------------------------
         *
         */

        expect(result).toBeUndefined();

        expect(knex.select).toHaveBeenCalledWith("");

        expect(fromMock).toHaveBeenCalledWith("users");

        expect(limitMock).toHaveBeenCalledWith(2);

        expect(offsetMock).toHaveBeenCalledWith(0);

        expect(knex).toHaveBeenCalledWith("users");

    });
});