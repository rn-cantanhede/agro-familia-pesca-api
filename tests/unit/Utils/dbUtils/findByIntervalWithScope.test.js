jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    findByIntervalWithScope
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

    test(
        "deve retornar lista com elementos encontrados", async () => {

            const resultMock = [
                {
                    ID: 1,
                    NOME: "João",
                    CPF: "000.000.000-00",
                    GENERO: "M",
                    DATA_NASCIMENTO: "2000-01-01",
                    ID_ASSOCIACAO: 1,
                    ID_SECRETARIA: 1
                },
                {
                    ID: 2,
                    NOME: "Maria",
                    CPF: "111.111.111-11",
                    GENERO: "M",
                    DATA_NASCIMENTO: "1990-05-10",
                    ID_ASSOCIACAO: 1,
                    ID_SECRETARIA: 1
                },
            ];

            const offsetMock = jest.fn().mockResolvedValue(resultMock);

            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));

            const andWhereMock = jest.fn(() => ({
                limit: limitMock
            }));

            const whereRawMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));

            const fromMock = jest.fn(() => ({
                whereRaw: whereRawMock
            }));

            knex.select.mockReturnValue({
                from: fromMock
            });

            const countMock = jest.fn().mockResolvedValue([
                { count: 2 }
            ]);

            const whereCountMock = jest.fn(() => ({
                count: countMock
            }));

            knex.mockReturnValue({
                where: whereCountMock
            });

            const result = await findByIntervalWithScope(
                1,
                "ID_SECRETARIA",
                "DATA_NASCIMENTO",
                "1990",
                "2000",
                true,
                "users",
                1,
                10
            );

            expect(result).toEqual({
                result: resultMock,
                total: [{ count: 2 }]
            });
        }
    );

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
                DATA_NASCIMENTO: "2000-01-01",
                ID_ASSOCIACAO: 1,
                ID_SECRETARIA: 1
            },
            {
                ID: 2,
                NOME: "Maria",
                CPF: "111.111.111-11",
                GENERO: "M",
                DATA_NASCIMENTO: "1990-05-10",
                ID_ASSOCIACAO: 1,
                ID_SECRETARIA: 1
            },
        ];

        const offsetMock = jest.fn().mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const andWhereMock = jest.fn(() => ({
            limit: limitMock
        }));

        const whereRawMock = jest.fn(() => ({
            andWhere: andWhereMock
        }));

        const fromMock = jest.fn(() => ({
            whereRaw: whereRawMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 2 }
        ]);

        const whereCountMock = jest.fn(() => ({
            count: countMock
        }));

        knex.mockReturnValue({
            where: whereCountMock
        });

        const result = await findByIntervalWithScope(
            "DATA_NASCIMENTO",
            "",
            "2000",
            "users",
            1,
            10
        );

        expect(result).toEqual({
            result: resultMock,
            total: [{ count: 2 }]
        });
    });

    /**
     * =========================================================
     * PAGINAÇÃO
     * =========================================================
     */

    test(
        "deve calcular corretamente a página",
        async () => {

            const offsetMock = jest.fn()
                .mockResolvedValue([
                    { id: 21 }
                ]);

            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));

            const andWhereMock = jest.fn(() => ({
                limit: limitMock
            }));

            const whereRawMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));

            const fromMock = jest.fn(() => ({
                whereRaw: whereRawMock
            }));

            knex.select.mockReturnValue({
                from: fromMock
            });

            // Segunda query:
            // knex(table).where(...).count(...)
            knex.mockReturnValue({
                where: jest.fn(() => ({
                    count: jest.fn()
                        .mockResolvedValue([
                            { count: 1 }
                        ])
                }))
            });

            /**
             * Página 3
             * Limite 10
             *
             * offset:
             *
             * (3 - 1) * 10
             * = 20
             */
            await findByIntervalWithScope(
                1,
                "ID_SECRETARIA",
                "DATA_NASCIMENTO",
                "1990",
                "2000",
                true,
                "users",
                3, // <-- aqui precisa ser 3
                10
            );

            expect(offsetMock).toHaveBeenCalledWith(20);
        }
    );



    /**
     * =========================================================
     * NENHUM RESULTADO
     * =========================================================
     */

    test(
        "deve retornar undefined quando não encontrar resultados",
        async () => {

            const offsetMock = jest.fn().mockResolvedValue([]);

            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));

            const andWhereMock = jest.fn(() => ({
                limit: limitMock
            }));

            const whereRawMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));

            const fromMock = jest.fn(() => ({
                whereRaw: whereRawMock
            }));

            knex.select.mockReturnValue({
                from: fromMock
            });

            const countMock = jest.fn().mockResolvedValue([
                { count: 2 }
            ]);

            const whereCountMock = jest.fn(() => ({
                count: countMock
            }));

            knex.mockReturnValue({
                where: whereCountMock
            });

            const result = await findByIntervalWithScope(
                1,
                "ID_SECRETARIA",
                "DATA_NASCIMENTO",
                "1990",
                "2000",
                true,
                "users",
                1,
                10
            );

            expect(result).toBeUndefined();

        }
    );

});