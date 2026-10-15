// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, findByInterval, insertData, updateData, deleteData, findWithScope, findByIntervalWithScope } = require("../../shared/Utils/dbUtils");
const table = "produto_movimentacao";
const view = "view_produto_movimentacao";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class MovimentacoesRepository {

    /**
     * Retorna todas as movimentações de produtos a partir da view.
     */

    async findAllMovimentacoes(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma movimentação específica pelo ID na view.
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Valida a existência de uma movimentação pelo ID diretamente na tabela base.
     */

    findByIdDelete(id) {
        return findBy("ID", id, false, table, 1, 1);
    };

    /**
     * Busca uma movimentação específica pelo ID_SECRETARIA na view.
     */

    async findByIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma movimentação específica pelo ID_PESSO na view.
     */

    async findByIdPessoa(id, page, limit) {
        const find = await findBy("ID_PESSOA", id, false, view, page, limit);

        if (!find) {
            return findBy("ID_PESSOA", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma movimentação específica pelo ID_ASSOCIADO na view.
     */

    async findByIdAssociado(id, page, limit) {
        const find = await findBy("ID_ASSOCIADO", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIADO", id, false, true, page, limit);
        };

        return find;
    };

    /**
     * Busca movimentações filtrando pelo DAP.
     */

    async findbyDap(dap, page, limit) {
        const find = await findBy("DAP", dap, true, view, page, limit);

        if (!find) {
            return findBy("DAP", dap, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca movimentações filtrando pelo nome ou identificador do produto.
     */

    async findbyProduto(produto, page, limit) {
        const find = await findBy("PRODUTO", produto, true, view, page, limit);

        if (!find) {
            return findBy("PRODUTO", produto, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca movimentações pela data exata da movimentação.
     */

    async findbyData(data, page, limit) {
        const find = await findBy("DATA_MOVIMENTACAO", data, true, view, page, limit);

        if (!find) {
            return findBy("DATA_MOVIMENTACAO", data, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca movimentações dentro de um intervalo de datas.
     */

    async findByInicioFim(inicio, fim, page, limit) {
        const find = await findByInterval("DATA_MOVIMENTACAO", inicio, fim, view, page, limit);

        if (!find) {
            return findByInterval("DATA_MOVIMENTACAO", inicio, fim, table, page, limit);
        };

        return find;
    };

    /**
     * Valida a existência de uma localização beneficiada pelo ID.
     */

    findID_LOCAL(id) {
        return findBy("ID", id, false, "localizacao_beneficiada");
    };

    /**
     * Valida a existência de um registro de agricultura familiar pelo ID.
     */

    findID_AGRICULTURA_FAMILIAR(id) {
        return findBy("ID", id, false, "agricultura_familiar");
    };

    /**
     * Valida a existência de um produto pelo ID.
     */

    findID_PRODUTO(id) {
        return findBy("ID", id, false, "produto");
    };

    /**
     * onsulta pelo ID limitando por escopo.
     */
    async findByIdScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo DAP limitando por escopo.
     */
    async findByDapScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * onsulta pelo PRODUTO limitando por escopo.
     */
    async findByProdutoScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * onsulta pelo DATA_MOVIMENTACAO limitando por escopo.
     */
    async findByDataScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo intervalo das datas de movimentação na view_produto_movimentacao limitando por escopo.
     */
    async findByInicioFimScope(sessionID, sessionField, field, inicio, fim, page, limit) {
        const find = await findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, view, page, limit);

        if (!find) {
            return findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, table, page, limit);
        };

        return find;
    };

    /**
     * Cria uma nova movimentação de produto.
     */

    createMovimentacao(movimentacao) {
        return insertData(movimentacao, table);
    };

    /**
     * Atualiza uma movimentação existente pelo ID.
     */

    updateMovimentacao(id, movimentacao) {
        return updateData(id, movimentacao, table);
    };

    /**
     * Remove uma movimentação do banco de dados pelo ID.
     */

    deleteMovimentacao(id) {
        return deleteData(id, table);
    };
};

module.exports = new MovimentacoesRepository();