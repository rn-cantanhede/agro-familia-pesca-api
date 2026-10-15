jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    loginDB
} = require("../../../../shared/Utils/dbUtils");

describe("loginDB", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * LOGIN
     * =========================================================
     */

    test("deve efetuar login", async () => {
        const resultMock = {
            ID: 1,
            LOGIN: "admin", 
            SENHA: "admin", 
            NIVEL: 1, 
            ID_PESSOA: 1, 
            ID_SECRETARIA: 1, 
            ID_ASSOCIACAO: 1
        };

        const firstMock = jest.fn().mockResolvedValue(resultMock);

        const whereMock = jest.fn(() => ({
            first: firstMock
        }));

        const selectMock = jest.fn(() => ({
            where: whereMock
        }));

        knex.mockReturnValue({
            select: selectMock
        });

        const result = await loginDB(resultMock);

        expect(result).toEqual(resultMock);
    });

    /**
     * =========================================================
     * NULL RESULT
     * =========================================================
     */

    test("deve retornar null", async () => {
        const resultMock = {
            ID: 1,
            LOGIN: "admin", 
            SENHA: "admin", 
            NIVEL: 1, 
            ID_PESSOA: 1, 
            ID_SECRETARIA: 1, 
            ID_ASSOCIACAO: 1
        };

        const firstMock = jest.fn().mockResolvedValue(undefined);

        const whereMock = jest.fn(() => ({
            first: firstMock
        }));

        const selectMock = jest.fn(() => ({
            where: whereMock
        }));

        knex.mockReturnValue({
            select: selectMock
        });

        const result = await loginDB(resultMock);

        expect(firstMock).toHaveBeenCalledWith();
        expect(result).toBeNull();
    });
});