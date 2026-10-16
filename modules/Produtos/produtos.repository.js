// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData } = require("../../shared/Utils/dbUtils");
const table = "produto";
const view = "view_produtos";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class ProdutoRepository {
    /**
     * Retorna todos os produtos disponíveis na view.
     */

    async findAllProdutos(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca um produto pelo ID.
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca produtos pelo nome.
     */
    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Valida a existência de um tipo de produto pelo ID.
     */

    findID_TIPO_PRODUTO(value) {
        return findBy("ID", value, false, "tipo_produto");
    };

    /**
     * Cria um novo produto.
     */

    createProduto(produto) {
        return insertData(produto, table);
    };

    /**
     * Atualiza os dados de um produto existente.
     */

    updateProduto(id, produto) {
        return updateData(id, produto, table);
    };

    /**
     * Remove um produto pelo ID.
     */

    deleteProduto(id) {
        return deleteData(id, table);
    };
};

module.exports = new ProdutoRepository();