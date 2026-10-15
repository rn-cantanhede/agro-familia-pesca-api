// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData } = require("../../shared/Utils/dbUtils");
const table = "tipo_produto";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class TiposProdutosRepository {

    /**
     * Retorna todos os tipos de produto cadastrados.
     */

    findallTipoProduto(page, limit) {
        return findAll(table, page, limit);
    };

    /**
     * Consulta tipo de produto pelo ID.
     */

    findById(id, page, limit) {
        return findBy("ID", id, false, table, page, limit);
    };

    /**
     * Consulta tipo de produto pelo nome.
     * Retorna múltiplos resultados.
     */

    findByName(name, page, limit) {
        return findBy("NOME", name, true, table, page, limit);
    };

    /**
     * Insere um novo tipo de produto.
     */

    insertCategoria(data) {
        return insertData(data, table);
    };

    /**
     * Atualiza um tipo de produto existente.
     */

    updateCategoria(id, data) {
        return updateData(id, data, table);
    };

    /**
     * Remove um tipo de produto.
     */
    
    deleteTipoProduto(id) {
        return deleteData(id, table);
    };
};

module.exports = new TiposProdutosRepository();