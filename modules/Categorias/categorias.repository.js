// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData } = require("../../shared/Utils/dbUtils");
const table = "categoria";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class CategoriasRepository {

    /**
     * Retorna todas as categorias cadastradas.
     */
    findAllCategorias(page, limit) {
        return findAll(table, page, limit);
    };

    /**
     * Busca uma categoria pelo seu identificador único (ID).
     */
    findById(id, page, limit) {
        return findBy("ID", id, false, table, page, limit);
    };

    /**
     * Busca categorias pelo nome.
     */

    findByName(name, page, limit) {
        return findBy("NOME", name, true, table, page, limit);
    };

    /**
     * Cria uma nova categoria.
     */

    createCategoria(categoria) {
        return insertData(categoria, table);
    };

    /**
     * Atualiza uma categoria existente.
     */

    updateCategoria(id, categoria) {
        return updateData(id, categoria, table);
    };

    /**
     * Remove uma categoria existente.
     */
    
    deleteCategoria(id) {
        return deleteData(id, table);
    };
};

module.exports = new CategoriasRepository();