jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    findByInterval
} = require("../../../../shared/Utils/dbUtils");


describe("findByInterval", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * RETURN ELEMENTOS
     * =========================================================
     */
    test("deve retornar lista com elementos encontrados", async () => {

        const resultMock = [
            {
                ID: 1,
                NOME: "João",
                CPF: "000.000.000-00",
                GENERO: "M",
                DATA_NASCIMENTO: "2000-01-01"
            },
            {
                ID: 2,
                NOME: "Maria",
                CPF: "111.111.111-11",
                GENERO: "M",
                DATA_NASCIMENTO: "1990-05-10"
            },
        ];

        const offsetMock = jest.fn().mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const whereMock = jest.fn(() => ({
            limit: limitMock
        }));

        const fromMock = jest.fn(() => ({
            whereRaw: whereMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 2 }
        ]);

        knex.mockReturnValue({
            count: countMock
        });

        const result = await findByInterval(
            "DATA_NASCIMENTO",
            "1990",
            "2000",
            "users",
            1,
            10
        );

        expect(result).toEqual({
            result: [
                {
                    ID: 1,
                    NOME: "João",
                    CPF: "000.000.000-00",
                    GENERO: "M",
                    DATA_NASCIMENTO: "2000-01-01"
                },
                {
                    ID: 2,
                    NOME: "Maria",
                    CPF: "111.111.111-11",
                    GENERO: "M",
                    DATA_NASCIMENTO: "1990-05-10"
                },
            ],
            total: [{ count: 2 }]
        });
    });

    /**
     * =========================================================
     * UMA DAS DATAS VAZIAS
     * =========================================================
     */
    test("deve retornar lista com elementos encontrados", async () => {

        const resultMock = [
            {
                ID: 1,
                NOME: "João",
                CPF: "000.000.000-00",
                GENERO: "M",
                DATA_NASCIMENTO: "2000-01-01"
            },
            {
                ID: 2,
                NOME: "Maria",
                CPF: "111.111.111-11",
                GENERO: "M",
                DATA_NASCIMENTO: "1990-05-10"
            },
        ];

        const offsetMock = jest.fn().mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const whereMock = jest.fn(() => ({
            limit: limitMock
        }));

        const fromMock = jest.fn(() => ({
            whereRaw: whereMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 2 }
        ]);

        knex.mockReturnValue({
            count: countMock
        });

        const result = await findByInterval(
            "DATA_NASCIMENTO",
            "",
            "2000",
            "users",
            1,
            10
        );

        expect(result).toEqual({
            result: [
                {
                    ID: 1,
                    NOME: "João",
                    CPF: "000.000.000-00",
                    GENERO: "M",
                    DATA_NASCIMENTO: "2000-01-01"
                },
                {
                    ID: 2,
                    NOME: "Maria",
                    CPF: "111.111.111-11",
                    GENERO: "M",
                    DATA_NASCIMENTO: "1990-05-10"
                },
            ],
            total: [{ count: 2 }]
        });
    });

    /**
     * =========================================================
     * NENHUM RESULTADO
     * =========================================================
     */
    test("deve retornar undefined quando não encontrar resultados", async () => {
        const offsetMock = jest.fn().mockResolvedValue([]);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const whereMock = jest.fn(() => ({
            limit: limitMock
        }));

        const fromMock = jest.fn(() => ({
            whereRaw: whereMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 0 }
        ]);

        knex.mockReturnValue({
            count: countMock
        });

        const result = await findByInterval(
            "DATA_NASCIMENTO",
            "1990",
            "2000",
            "users",
            1,
            10
        );

        expect(result).toBeUndefined();
    });
});