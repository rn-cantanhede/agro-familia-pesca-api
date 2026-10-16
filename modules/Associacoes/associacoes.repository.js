// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData, findWithScope } = require("../../shared/Utils/dbUtils");
const table = "associacao";
const view = "view_associacoes";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à associações.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class Associacoes {

    /**
     * Retorna todas as associações cadastradas.
     */
    async findAllAssociacoes(page, limit) {
        const find = await findAll(view, page, limit);
 
        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma associação pelo ID.
     */
    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma associação pelo ID diretamente na tabela base `associacao`.
     */
    findByIdDelete(id) {
        return findBy("ID", id, false, table);
    };

    /**
     * Busca associações pelo nome.
     */
    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca associações pelo id da secretaria.
     */
    async findbyIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca associações pela categoria.
     */
    async findbyCategoria(categoria, page, limit) {
        const find = await findBy("CATEGORIA", categoria, true, view, page, limit);

        if (!find) {
            return findBy("CATEGORIA", categoria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca associações vinculadas a uma secretaria.
     */
    async findbySecretaria(secretaria, page, limit) {
        const find = await findBy("SECRETARIA", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("SECRETARIA", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma secretaria pelo ID.
     */
    findID_SECRETARIA(id) {
        return findBy("ID", id, false, "secretaria");
    };

    /**
     * Busca uma categoria pelo ID.
     */
    findID_CATEGORIA(id) {
        return findBy("ID", id, false, "categoria");
    };

    /**
    * Consulta pelo ID limitando por escopo.
    */
    async findByIdScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo NOME limitando por escopo.
     */
    async findByNameScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela categoria limitando por escopo.
     */
    async findByCategoriaScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Cria uma nova associação.
     */
    createAssociacao(associacao) {
        return insertData(associacao, table);
    };

    /**
     * Atualiza os dados de uma associação existente.
     */
    updateAssociacao(id, associacao) {
        return updateData(id, associacao, table);
    };

    /**
     * Remove uma associação do banco de dados.
     */
    deleteAssociacao(id) {
        return deleteData(id, table);
    };
};

module.exports = new Associacoes();