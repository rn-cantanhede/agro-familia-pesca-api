// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData, findWithScope } = require("../../shared/Utils/dbUtils");
const table = "programa";
const view = "view_programas";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class ProgramasRepository {

    /**
     * Retorna todos os registros de programas a partir da view.
     */

    async findAllProgramas(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca um programa pelo ID na view.
     * O parâmetro `false` indica busca exata (não usa LIKE).
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca um programa pelo ID diretamente na tabela real `programa`.
     * Usado geralmente antes de operações de exclusão.
     */

    async findByIdDelete(id, page, limit) {
        const find = await findBy("ID", id, false, "programa", page, limit);

        if (!find) {
            return findBy("ID", id, table, "programa", page, limit);
        };

        return find;
    };

    /**
     * Busca programas pelo nome.
     * O parâmetro `true` indica busca parcial (LIKE).
     */

    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas vinculados a uma secretaria específica.
     * A busca é parcial para permitir flexibilidade.
     */

    async findbySecretaria(secretaria, page, limit) {
        const find = await findBy("SECRETARIA", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("SECRETARIA", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas vinculados a um id de secretaria específica.
     * A busca é parcial para permitir flexibilidade.
     */

    async findbyIdSecretaria(secretaria, page, limit) {
        const find = await findBy("ID_SECRETARIA", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas vinculados a um id de associação específica.
     * A busca é parcial para permitir flexibilidade.
     */

    async findbyIdAssociacao(secretaria, page, limit) {
        const find = await findBy("ID_ASSOCIACAO", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIACAO", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas por estado.
     */

    async findbyEstado(estado, page, limit) {
        const find = await findBy("ESTADO", estado, true, view, page, limit);

        if (!find) {
            return findBy("ESTADO", estado, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas pela origem do recurso financeiro.
     */

    async findbyOrigemRecurso(recurso, page, limit) {
        const find = await findBy("ORIGEM_RECURSO", recurso, true, view, page, limit);

        if (!find) {
            return findBy("ORIGEM_RECURSO", recurso, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas com data de início correspondente.
     */

    async findbyDataInicio(data, page, limit) {
        const find = await findBy("DATA_INICIO", data, true, view, page, limit);

        if (!find) {
            return findBy("DATA_INICIO", data, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca programas com data de fim correspondente.
     */

    async findbyDataFim(data, page, limit) {
        const find = await findBy("DATA_FIM", data, true, view, page, limit);

        if (!find) {
            return findBy("DATA_FIM", data, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma secretaria pelo ID diretamente na tabela `secretaria`.
     * Normalmente usado para validações de integridade.
     */

    findID_SECRETARIA(value, page, limit) {
        return findBy("ID", value, false, "secretaria", page, limit);
    };

    /**
     * Consulta pelo ID na view_programas limitando por escopo.
     */
    async findByIdScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo NOME na view_programas limitando por escopo.
     */
    async findByNameScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela secretaria na view_programas limitando por escopo.
     */
    async findBySecretariaScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo estado na view_programas limitando por escopo.
     */
    async findByEstadoScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela origem de recusos na view_programas limitando por escopo.
     */
    async findByOrigemRecursoScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela data de início na view_programas limitando por escopo.
     */
    async findByDataInicioScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pela data de termino na view_programas limitando por escopo.
     */
    async findByDataFimScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo intervalo de datas na view_programas limitando por escopo.
     */
    // findByInicioFimScope(sessionID, sessionField, field, inicio, fim, page, limit) {
    //     return findByIntervalWithScope(sessionID, sessionField, field, inicio, fim, true, view, page, limit);
    // };

    /**
     * Insere um novo programa na tabela `programa`.
     */

    createPrograma(programa) {
        return insertData(programa, table);
    };

    /**
     * Atualiza um programa existente pelo ID.
     */

    updatePrograma(id, programa) {
        return updateData(id, programa, table);
    };

    /**
     * Remove um programa da tabela `programa` pelo ID.
     */

    deletePrograma(id) {
        return deleteData(id, table);
    };
};

module.exports = new ProgramasRepository();