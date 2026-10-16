jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    updateData
} = require("../../../../shared/Utils/dbUtils");

describe("updateData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * UPDATE
     * =========================================================
     */

    test("deve Modificar dados", async () => {
        const resultMock = {
            ID: 1,
            NOME: "João",
            CPF: "000.000.000-00",
            GENERO: "M"
        };

        const updateMock = jest.fn().mockResolvedValue(resultMock);

        const whereMock = jest.fn(() => ({
            update: updateMock
        }));

        knex.mockReturnValue({
            where: whereMock
        });

        const result = await updateData(
            1,
            {
                ID: 1,
                NOME: "Marcos",
                CPF: "000.000.000-00",
                GENERO: "M"
            },
            "users"
        );

        expect(knex).toHaveBeenCalledWith("users");
        expect(result).not.toEqual(resultMock);
    });
});