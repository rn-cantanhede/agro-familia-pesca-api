jest.mock("../../../../database/connection", () => {
    const knex = jest.fn();

    knex.select = jest.fn();

    return knex;
});

const knex = require("../../../../database/connection");

const {
    findBy
} = require("../../../../shared/Utils/dbUtils");

describe("findBy", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * =========================================================
     * NUMBER
     * =========================================================
     */

    test("deve retornar lista com elementos encontrados", async () => {
        const resultMock = [
            {
                ID: 1,
                NOME: "João",
                CPF: "000.000.000-00",
                GENERO: "M"
            },
        ];

        const offsetMock = jest.fn().mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const orderByMock = jest.fn(() => ({
            limit: limitMock
        }));

        const whereMock = jest.fn(() => ({
            orderBy: orderByMock,
            from: jest.fn(() => ({
                orderBy: orderByMock
            }))
        }));

        const fromMock = jest.fn(() => ({
            where: whereMock,
            orderBy: orderByMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 1 }
        ]);

        const countAndWhereMock = jest.fn(() => ({
            count: countMock
        }));

        const countWhereMock = jest.fn(() => ({
            andWhere: countAndWhereMock,
            count: countMock
        }));

        knex.mockReturnValue({
            where: countWhereMock
        });

        const result = await findBy(
            "ID",
            1,
            false,
            "users",
            1,
            10
        );

        expect(result).toEqual({
            result: resultMock[0],
            total: [{ count: 1 }]
        });
    });

    /**
     * =========================================================
     * STRING
     * =========================================================
     */

    test("deve retornar lista com elementos encontrados", async () => {
        const resultMock = [
            {
                ID: 1,
                NOME: "João",
                CPF: "000.000.000-00",
                GENERO: "M"
            },
        ];

        const offsetMock = jest.fn().mockResolvedValue(resultMock);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const orderByMock = jest.fn(() => ({
            limit: limitMock
        }));

        const whereMock = jest.fn(() => ({
            orderBy: orderByMock,
            from: jest.fn(() => ({
                orderBy: orderByMock
            }))
        }));

        const fromMock = jest.fn(() => ({
            where: whereMock,
            orderBy: orderByMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 1 }
        ]);

        const countAndWhereMock = jest.fn(() => ({
            count: countMock
        }));

        const countWhereMock = jest.fn(() => ({
            andWhere: countAndWhereMock,
            count: countMock
        }));

        knex.mockReturnValue({
            where: countWhereMock
        });

        const result = await findBy(
            "NOME",
            "João",
            true,
            "users",
            1,
            10
        );

        expect(result).toEqual({
            result: resultMock,
            total: [{ count: 1 }]
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

            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));

            const whereMock = jest.fn(() => ({
                orderBy: orderByMock,
                from: jest.fn(() => ({
                    orderBy: orderByMock
                }))
            }));

            const fromMock = jest.fn(() => ({
                where: whereMock,
                orderBy: orderByMock
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
            await findBy(
                "NOME",
                "João",
                true,
                "users",
                3,
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

    test("deve retornar lista com elementos encontrados", async () => {
        const offsetMock = jest.fn().mockResolvedValue([]);

        const limitMock = jest.fn(() => ({
            offset: offsetMock
        }));

        const orderByMock = jest.fn(() => ({
            limit: limitMock
        }));

        const whereMock = jest.fn(() => ({
            orderBy: orderByMock,
            from: jest.fn(() => ({
                orderBy: orderByMock
            }))
        }));

        const fromMock = jest.fn(() => ({
            where: whereMock,
            orderBy: orderByMock
        }));

        knex.select.mockReturnValue({
            from: fromMock
        });

        const countMock = jest.fn().mockResolvedValue([
            { count: 1 }
        ]);

        const countAndWhereMock = jest.fn(() => ({
            count: countMock
        }));

        const countWhereMock = jest.fn(() => ({
            andWhere: countAndWhereMock,
            count: countMock
        }));

        knex.mockReturnValue({
            where: countWhereMock
        });

        const result = await findBy(
            "NOME",
            "João",
            true,
            "users",
            1,
            10
        );

        expect(result).toBeUndefined();
    });
});