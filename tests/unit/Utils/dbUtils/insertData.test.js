jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    insertData
} = require("../../../../shared/Utils/dbUtils");

describe("insertData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * INSERT
     * =========================================================
     */

    test("deve inserir dados", async () => {
        const resultMock = {
            ID: 1,
            NOME: "João",
            CPF: "000.000.000-00",
            GENERO: "M"
        };

        const insertMock = jest.fn().mockResolvedValue(resultMock);

        knex.mockReturnValue({
            insert: insertMock
        });

        const result = await insertData(resultMock, "users");

        expect(knex).toHaveBeenCalledWith("users");
        expect(insertMock).toHaveBeenCalledWith(resultMock);
        expect(result).toEqual(resultMock);
    });
});