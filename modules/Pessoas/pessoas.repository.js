// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, findByInterval, insertData, updateData, deleteData, findWithScope, findByIntervalWithScope } = require("../../shared/Utils/dbUtils");
const table = "pessoa";
const view = "view_pessoas";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class PessoasRepository {
    /**
     * Retorna a lista completa de pessoas.
     */

    async findAllPessoas(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma pessoa pelo ID.
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    async findId(id) {
        const find = await findBy("ID", id, false, table, 1, 1);

        if (!find) {
            return findBy("ID", id, false, table, 1, 1);
        };

        return find;
    };

    /**
     * Busca pessoas pelo id da secretaria.
     */
    async findByIdSecretaria(id) {
        const find = await findBy("ID_SECRETARIA", id, true, view, 1, 1);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, 1, 1);
        };

        return find;
    };

    /**
     * Busca pessoas pelo id da associação.
     */
    async findByIdAssociacaao(id) {
        const find = await findBy("ID_ASSOCIACAO", id, true, view, 1, 1);

        if (!find) {
            return findBy("ID_ASSOCIACAO", id, true, table, 1, 1);
        };

        return find;
    };

    /**
     * Busca pessoas pelo nome.
     */

    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca pessoas filtrando pelo gênero.
     */

    async findbyGenero(genero, page, limit) {
        const find = await findBy("GENERO", genero, true, view, page, limit);

        if (!find) {
            return findBy("GENERO", genero, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca pessoas pela data de nascimento.
     */

    async findbyData(data, page, limit) {
        const find = await findBy("DATA_NASCIMENTO", data, true, view, page, limit);

        if (!find) {
            return findBy("DATA_NASCIMENTO", data, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca pessoas dentro de um intervalo de datas de nascimento.
     */

    async findByInicioFim(inicio, fim, page, limit) {
        const find = await findByInterval("DATA_NASCIMENTO", inicio, fim, view, page, limit);

        if (!find) {
            return findByInterval("DATA_NASCIMENTO", inicio, fim, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo ID na view_usuarios limitando por escopo.
     */
    async findByIdScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo NOME na view_usuarios limitando por escopo.
     */
    async findByNameScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo GENERO na view_usuarios limitando por escopo.
     */
    async findByGeneroScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo DATA na view_usuarios limitando por escopo.
     */
    async findByDataScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo intervalo dos anos de ascimento na view_usuarios limitando por escopo.
     */
    async findByInicioFimScope(sessionID, sessionField, field, inicio, fim, page, limit) {
        const find = await findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, view, page, limit);

        if (!find) {
            return findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, table, page, limit);
        };

        return find;
    };

    /**
     * Cria um novo registro de pessoa.
     */

    createPessoa(data) {
        return insertData(data, table);
    };

    /**
     * Atualiza os dados de uma pessoa existente.
     */

    updatePessoa(id, pessoa) {
        return updateData(id, pessoa, table);
    };

    /**
     * Remove uma pessoa pelo ID.
     */

    deletePessoa(id) {
        return deleteData(id, table);
    };
};

module.exports = new PessoasRepository();