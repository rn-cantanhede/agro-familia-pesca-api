// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, findByInterval, insertData, updateData, deleteData, findWithScope, findByIntervalWithScope } = require("../../shared/Utils/dbUtils");
const table = "associado";
const view = "view_pessoas";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class AssociadosRepository {

    /**
     * Retorna todos os registros da view de associados.
     */

    async findAllAssociados(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Consulta associado pelo ID na view principal.
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    findId(id, page, limit) {
        return findBy("ID", id, false, "view_associados", page, limit);
    };

    /**
     * Busca pessoas pelo id da secretaria.
     */
    async findByIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca pessoas pelo id da pessoa.
     */

    async findByIdPessoa(id, page, limit) {
        const find = await findBy("ID_PESSOA", id, false, view, page, limit);

        if (!find) {
            return findBy("ID_PESSOA", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta associado pelo ID na tabela principal.
     */

    findByIdDelete(id, page, limit) {
        return findBy("ID", id, false, table, page, limit);
    };

    /**
     * Consulta associados por nome, retornando múltiplos resultados.
     */

    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta associado pelo CAF.
     */

    async findbyCaf(caf, page, limit) {
        const find = await findBy("CAF", caf, false, view, page, limit);

        if (!find) {
            return findBy("CAF", caf, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta associado pelo DAP.
     */

    async findbyDap(dap, page, limit) {
        const find = await findBy("DAP", dap, false, view, page, limit);

        if (!find) {
            return findBy("DAP", dap, false, table, page, limit);
        };

        return find;
    };

    /**
     * Lista associados filtrando por associação.
     */

    async findbyAssociacao(associacao, page, limit) {
        const find = await findBy("ASSOCIACAO", associacao, true, view, page, limit);

        if (!find) {
            return findBy("ASSOCIACAO", associacao, true, table, page, limit);
        };

        return find;
    };

    /**
     * Lista associados filtrando por id da associação.
     */

    async findbyIdAssociacao(id, page, limit) {
        const find = await findBy("ID_ASSOCIACAO", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIACAO", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Lista associados filtrando por secretaria.
     */
    async findbySecretaria(secretaria, page, limit) {
        const find = await findBy("SECRETARIA", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("SECRETARIA", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Lista associados filtrando pelo ID da secretaria.
     */
    async findbyIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta associados pela data de validade do CAF.
     */

    async findbyDataCaf(data, page, limit) {
        const find = await findBy("VALIDADE_CAF", data, true, view, page, limit);

        if (!find) {
            return findBy("VALIDADE_CAF", data, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta registros pela validade do CAF dentro de um intervalo.
     */

    async findByInicioFimCaf(inicio, fim, page, limit) {
        const find = await findByInterval("VALIDADE_CAF", inicio, fim, view, page, limit);

        if (!find) {
            return findByInterval("VALIDADE_CAF", inicio, fim, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta ID na tabela pessoa.
     */

    findID_PESSOA(id, page, limit) {
        return findBy("ID", id, false, "pessoa", page, limit);
    };

    /**
     * Consulta ID na tabela associacao.
     */

    findID_ASSOCIACAO(id, page, limit) {
        return findBy("ID", id, false, "associacao", page, limit);
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
     * Consulta pelo caf limitando por escopo.
     */
    async findByCafScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo caf limitando por escopo.
     */
    async findByDapScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela validade do caf limitando por escopo.
     */
    async findByDataCafScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo intervalo das datas de movimentação na view_pessoas limitando por escopo.
     */
    async findByInicioFimCafScope(sessionID, sessionField, field, inicio, fim, page, limit) {
        const find = await findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, view, page, limit);

        if (!find) {
            return findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, table, page, limit);
        };

        return find;
    };

    /**
     * Insere um novo associado na tabela correspondente.
     */

    createAssociado(associado) {
        return insertData(associado, table);
    };

    /**
     * Modifica um associado na tabela correspondente.
     */

    updateAssociado(id, associado) {
        return updateData(id, associado, table);
    };

    /**
     * Deleta um associado na tabela correspondente.
     */

    deleteAssociado(id) {
        return deleteData(id, table);
    };
};

module.exports = new AssociadosRepository();
