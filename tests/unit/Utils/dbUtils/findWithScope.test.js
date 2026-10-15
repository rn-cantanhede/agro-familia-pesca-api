/**
 * Mock da conexão do Knex.
 *
 * É importante fazer isso antes de importar dbUtils,
 * porque dbUtils importa a conexão quando é carregado.
 */
jest.mock("../../../../database/connection", () => {

    const knex = jest.fn();

    // Mock do knex.select(...)
    knex.select = jest.fn();

    return knex;
});


/**
 * Importamos o knex mockado.
 */
const knex = require("../../../../database/connection");


/**
 * Importamos SOMENTE a função que queremos testar.
 *
 * As funções:
 *
 * - findWithScope
 *
 * são detalhes internos da implementação.
 */
const {
    findWithScope
} = require("../../../../shared/Utils/dbUtils");


describe("findWithScope", () => {

    beforeEach(() => {

        /**
         * Limpa chamadas anteriores dos mocks.
         */
        jest.clearAllMocks();

    });


    /**
     * =========================================================
     * STRING
     * =========================================================
     */

    test(
        "deve realizar busca textual quando value for uma string",
        async () => {

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


            /**
             * .limit(...)
             */
            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));


            /**
             * .orderBy(...)
             */
            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));


            /**
             * .andWhere(...)
             */
            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            /**
             * .where(...)
             */
            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            /**
             * .from(...)
             */
            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            /**
             * Montamos a cadeia:
             *
             * knex.select("")
             *     .from(...)
             *     .where(...)
             *     .andWhere(...)
             *     .orderBy(...)
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
             *
             * O código também executa:
             *
             * knex(table)
             *     .where(...)
             *     .andWhere(...)
             *     .count(...)
             */

            const countMock = jest.fn()
                .mockResolvedValue([
                    { count: 1 }
                ]);


            const countAndWhereMock = jest.fn(() => ({
                count: countMock
            }));


            const countWhereMock = jest.fn(() => ({
                andWhere: countAndWhereMock
            }));


            /**
             * Quando knex("users") for executado,
             * retorna nossa cadeia de count.
             */
            knex.mockReturnValue({
                where: countWhereMock
            });


            /**
             * -------------------------------------------------
             * EXECUÇÃO
             * -------------------------------------------------
             */

            await findWithScope(
                10,             // sessionID
                "user_id",      // sessionField
                "name",         // field
                "João",         // value
                false,          // multiple
                "users",        // table
                1,              // page
                10              // limit
            );


            /**
             * -------------------------------------------------
             * VERIFICAÇÕES
             * -------------------------------------------------
             *
             * Como "João" é uma string, a função deve
             * utilizar LIKE.
             */

            expect(whereMock).toHaveBeenCalledWith(
                "name",
                "like",
                "%João%"
            );


            /**
             * Verifica se o session scope foi aplicado.
             */
            expect(andWhereMock).toHaveBeenCalledWith(
                "user_id",
                10
            );


            /**
             * Página 1:
             *
             * (1 - 1) * 10 = 0
             */
            expect(offsetMock).toHaveBeenCalledWith(0);

        }
    );


    /**
     * =========================================================
     * NÚMERO
     * =========================================================
     */

    test(
        "deve realizar busca numérica quando value for um número",
        async () => {

            const resultMock = [
                {
                    id: 25,
                    name: "João"
                }
            ];


            /**
             * Mock da cadeia principal.
             */
            const offsetMock = jest.fn()
                .mockResolvedValue(resultMock);


            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));


            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));


            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            knex.select.mockReturnValue({
                from: fromMock
            });


            /**
             * Mock do count.
             */
            const countMock = jest.fn()
                .mockResolvedValue([
                    { count: 1 }
                ]);


            const countAndWhereMock = jest.fn(() => ({
                count: countMock
            }));


            const countWhereMock = jest.fn(() => ({
                andWhere: countAndWhereMock
            }));


            knex.mockReturnValue({
                where: countWhereMock
            });


            /**
             * Executamos com value numérico.
             */
            await findWithScope(
                10,
                "user_id",
                "id",
                25,
                false,
                "users",
                1,
                10
            );


            /**
             * Como value = 25,
             * esperamos igualdade:
             *
             * .where("id", 25)
             */
            expect(whereMock).toHaveBeenCalledWith(
                "id",
                25
            );


            /**
             * Verifica o session scope.
             */
            expect(andWhereMock).toHaveBeenCalledWith(
                "user_id",
                10
            );


            /**
             * Página 1.
             */
            expect(offsetMock).toHaveBeenCalledWith(0);

        }
    );


    /**
     * =========================================================
     * STRING NUMÉRICA
     * =========================================================
     */

    test(
        "deve tratar uma string numérica como número",
        async () => {

            const offsetMock = jest.fn()
                .mockResolvedValue([
                    {
                        id: 25
                    }
                ]);


            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));


            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));


            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            knex.select.mockReturnValue({
                from: fromMock
            });


            knex.mockReturnValue({
                where: jest.fn(() => ({
                    andWhere: jest.fn(() => ({
                        count: jest.fn()
                            .mockResolvedValue([
                                { count: 1 }
                            ])
                    }))
                }))
            });


            /**
             * "25" é uma string, mas:
             *
             * isNaN("25") === false
             *
             * Portanto seu código entra na busca numérica.
             */
            await findWithScope(
                10,
                "user_id",
                "id",
                "25",
                false,
                "users",
                1,
                10
            );


            expect(whereMock).toHaveBeenCalledWith(
                "id",
                "25"
            );

        }
    );


    /**
     * =========================================================
     * MULTIPLE
     * =========================================================
     */

    test(
        "deve respeitar multiple quando realizar busca textual",
        async () => {

            const resultMock = [
                { id: 1 },
                { id: 2 }
            ];


            const offsetMock = jest.fn()
                .mockResolvedValue(resultMock);


            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));


            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));


            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            knex.select.mockReturnValue({
                from: fromMock
            });


            knex.mockReturnValue({
                where: jest.fn(() => ({
                    andWhere: jest.fn(() => ({
                        count: jest.fn()
                            .mockResolvedValue([
                                { count: 2 }
                            ])
                    }))
                }))
            });


            /**
             * multiple = true
             */
            const response = await findWithScope(
                10,
                "user_id",
                "name",
                "João",
                true,
                "users",
                1,
                10
            );


            /**
             * Como estamos testando findWithScope,
             * aqui verificamos o comportamento final.
             */
            expect(response).toEqual({
                result: resultMock,
                total: [
                    { count: 2 }
                ]
            });

        }
    );


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


            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            knex.select.mockReturnValue({
                from: fromMock
            });


            knex.mockReturnValue({
                where: jest.fn(() => ({
                    andWhere: jest.fn(() => ({
                        count: jest.fn()
                            .mockResolvedValue([
                                { count: 1 }
                            ])
                    }))
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
            await findWithScope(
                10,
                "user_id",
                "id",
                21,
                false,
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

    test(
        "deve retornar undefined quando não encontrar resultados",
        async () => {

            /**
             * Simula banco sem resultados.
             */
            const offsetMock = jest.fn()
                .mockResolvedValue([]);


            const limitMock = jest.fn(() => ({
                offset: offsetMock
            }));


            const orderByMock = jest.fn(() => ({
                limit: limitMock
            }));


            const andWhereMock = jest.fn(() => ({
                orderBy: orderByMock
            }));


            const whereMock = jest.fn(() => ({
                andWhere: andWhereMock
            }));


            const fromMock = jest.fn(() => ({
                where: whereMock
            }));


            knex.select.mockReturnValue({
                from: fromMock
            });


            knex.mockReturnValue({
                where: jest.fn(() => ({
                    andWhere: jest.fn(() => ({
                        count: jest.fn()
                            .mockResolvedValue([
                                { count: 0 }
                            ])
                    }))
                }))
            });


            const response = await findWithScope(
                10,
                "user_id",
                "id",
                999,
                false,
                "users",
                1,
                10
            );


            expect(response).toBeUndefined();

        }
    );

});