/**
 * Mock da conexão do Knex.
 *
 * Precisa ser declarado antes de importar dbUtils,
 * pois o módulo importa a conexão durante sua inicialização.
 */
jest.mock("../../../../database/connection", () => jest.fn());

const knex = require("../../../../database/connection");

const {
    findWithScope
} = require("../../../../shared/Utils/dbUtils");


/**
 * Cria um mock de query builder do Knex.
 *
 * Os métodos de construção da consulta retornam
 * o próprio builder para permitir o encadeamento.
 */
function createQueryBuilder({
    result = [],
    count = 0
} = {}) {
    const builder = {};

    const mocks = {
        where: jest.fn(() => builder),
        andWhere: jest.fn(() => builder),
        orderBy: jest.fn(() => builder),
        limit: jest.fn(() => builder),
        offset: jest.fn().mockResolvedValue(result),
        count: jest.fn().mockResolvedValue([
            { count }
        ])
    };

    Object.assign(builder, mocks);

    return {
        builder,
        mocks
    };
}


/**
 * Configura as consultas utilizadas pela função.
 *
 * Ordem das chamadas:
 * 1. knex(table): consulta dos registros.
 * 2. knex(table): consulta da contagem.
 * 3. knex(table).columnInfo(): verificação das colunas.
 */
function setupKnex({
    result = [],
    count = 0,
    columns = {
        id: {},
        name: {},
        user_id: {}
    }
} = {}) {
    const query = createQueryBuilder({
        result
    });

    const countQuery = createQueryBuilder({
        count
    });

    const columnInfo = jest.fn()
        .mockResolvedValue(columns);

    knex
        .mockReturnValueOnce(query.builder)
        .mockReturnValueOnce(countQuery.builder)
        .mockReturnValueOnce({
            columnInfo
        });

    return {
        query,
        countQuery,
        columnInfo
    };
}


describe("findWithScope", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        knex.mockReset();
    });


    /**
     * =========================================================
     * BUSCA TEXTUAL
     * =========================================================
     */

    test("deve realizar busca textual utilizando LIKE", async () => {
        const resultMock = [
            {
                id: 1,
                name: "João",
                user_id: 10
            }
        ];

        const { query, countQuery } = setupKnex({
            result: resultMock,
            count: 1
        });

        const response = await findWithScope(
            10,
            "user_id",
            "name",
            "João",
            false,
            "users",
            1,
            10
        );

        expect(query.mocks.where).toHaveBeenCalledWith(
            "name",
            "like",
            "%João%"
        );

        expect(countQuery.mocks.where).toHaveBeenCalledWith(
            "name",
            "like",
            "%João%"
        );

        expect(query.mocks.andWhere).toHaveBeenCalledWith(
            "user_id",
            10
        );

        expect(countQuery.mocks.andWhere).toHaveBeenCalledWith(
            "user_id",
            10
        );

        expect(response).toEqual({
            result: resultMock[0],
            total: 1
        });
    });


    /**
     * =========================================================
     * BUSCA NUMÉRICA
     * =========================================================
     */

    test("deve realizar busca por igualdade quando value for numérico", async () => {
        const resultMock = [
            {
                id: 25,
                user_id: 10
            }
        ];

        const { query } = setupKnex({
            result: resultMock,
            count: 1
        });

        const response = await findWithScope(
            10,
            "user_id",
            "id",
            25,
            false,
            "users",
            1,
            10
        );

        expect(query.mocks.where).toHaveBeenCalledWith(
            "id",
            25
        );

        expect(query.mocks.orderBy).toHaveBeenCalledWith(
            "id",
            "asc"
        );

        expect(response).toEqual({
            result: resultMock[0],
            total: 1
        });
    });


    /**
     * =========================================================
     * STRING NUMÉRICA
     * =========================================================
     */

    test("deve realizar busca por igualdade quando value for uma string numérica", async () => {
        const { query } = setupKnex({
            result: [{ id: 25 }],
            count: 1
        });

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

        expect(query.mocks.where).toHaveBeenCalledWith(
            "id",
            "25"
        );
    });


    /**
     * =========================================================
     * MÚLTIPLOS RESULTADOS
     * =========================================================
     */

    test("deve retornar todos os registros quando multiple for true", async () => {
        const resultMock = [
            { id: 1 },
            { id: 2 }
        ];

        const { query } = setupKnex({
            result: resultMock,
            count: 2
        });

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

        expect(response).toEqual({
            result: resultMock,
            total: 2
        });

        expect(query.mocks.limit).toHaveBeenCalledWith(10);
    });


    /**
     * =========================================================
     * PAGINAÇÃO
     * =========================================================
     */

    test("deve calcular corretamente o offset da página", async () => {
        const { query } = setupKnex({
            result: [{ id: 21 }],
            count: 1
        });

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

        expect(query.mocks.limit).toHaveBeenCalledWith(10);

        expect(query.mocks.offset).toHaveBeenCalledWith(20);
    });


    /**
     * =========================================================
     * NENHUM RESULTADO
     * =========================================================
     */

    test("deve retornar undefined quando não encontrar registros", async () => {
        setupKnex({
            result: [],
            count: 0
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
    });


    /**
     * =========================================================
     * COLUNA DE ESCOPO INEXISTENTE
     * =========================================================
     */

    test("deve retornar undefined quando a coluna de escopo não existir", async () => {
        const { query, countQuery } = setupKnex({
            columns: {
                id: {},
                name: {}
            }
        });

        const response = await findWithScope(
            10,
            "user_id",
            "name",
            "João",
            false,
            "users",
            1,
            10
        );

        expect(response).toBeUndefined();

        expect(query.mocks.andWhere).not.toHaveBeenCalled();

        expect(countQuery.mocks.andWhere).not.toHaveBeenCalled();

        expect(query.mocks.offset).not.toHaveBeenCalled();
    });


    /**
     * =========================================================
     * CONTAGEM DOS RESULTADOS
     * =========================================================
     */

    test("deve converter o total de resultados para Number", async () => {
        const { countQuery } = setupKnex({
            result: [{ id: 1 }],
            count: "15"
        });

        const response = await findWithScope(
            10,
            "user_id",
            "name",
            "João",
            false,
            "users",
            1,
            10
        );

        expect(countQuery.mocks.count).toHaveBeenCalledWith(
            "* as count"
        );

        expect(response.total).toBe(15);
        expect(typeof response.total).toBe("number");
    });

});