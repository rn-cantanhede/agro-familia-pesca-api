jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    deleteData
} = require("../../../../shared/Utils/dbUtils");

describe("deleteData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * DELETE
     * =========================================================
     */

    test("deve deletar dados", async () => {
        const resultMock = {
            ID: 1,
            NOME: "João",
            CPF: "000.000.000-00",
            GENERO: "M"
        };

        const deleteMock = jest.fn().mockResolvedValue(resultMock);

        const whereMock = jest.fn(() => ({
            delete: deleteMock
        }));

        knex.mockReturnValue({
            where: whereMock
        });

        const result = await deleteData(
            1,
            "users"
        );

        expect(knex).toHaveBeenCalledWith("users");
        expect(whereMock).toHaveBeenCalledWith({ ID: 1 });
        expect(deleteMock).toHaveBeenCalled();
        expect(result).toEqual("Registro de ID: 1 da tabela users foi deletado");
    });
});