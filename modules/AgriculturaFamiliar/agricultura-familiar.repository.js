// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData, findWithScope } = require("../../shared/Utils/dbUtils");
const table = "agricultura_familiar";
const view = "view_agricultura_familiar";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à Agricultura Familiar.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */
class AgriculturaFamiliarRepository {

    /**
     * Busca todos os registros de agricultura familiar.
     */
    async findAllAgriculturaFamiliar(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca um registro específico pelo ID.
     */
    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca um registro específico pelo ID da pessoa.
     */
    async findByIdPessoa(id, page, limit) {
        const find = await findBy("ID_PESSOA", id, false, view, page, limit);

        if (!find) {
            return findBy("ID_PESSOA", id, false, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca registros pelo ID da secretaria.
     */
    async findByIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca registros pelo ID da associacao.
     */
    async findByIdAssociacao(id, page, limit) {
        const find = await findBy("ID_ASSOCIACAO", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIACAO", id, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca um registro pelo ID diretamente na tabela real,
     * geralmente utilizada antes de operações de exclusão.
     */
    findByIdDelete(id) {
        return findBy("ID", id, false, table);
    };

    /**
     * Busca registros pelo nome.
     */
    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca registros pelo número do CAF.
     *
     * Busca exata, pois CAF é um identificador único.
     */
    async findbyCaf(caf, page, limit) {
        const find = await findBy("CAF", caf, false, view, page, limit);

        if (!find) {
            return findBy("CAF", caf, false, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca registros pelo número da DAP.
     *
     * Busca exata, pois DAP é um identificador único.
     */
    async findbyDap(dap, page, limit) {
        const find = await findBy("DAP", dap, false, view, page, limit);

        if (!find) {
            return findBy("DAP", dap, false, table, page, limit);
        };
        
        return find;
    };

    /**
     * Busca registros pelo nome do programa.
     */
    async findbyPrograma(programa, page, limit) {
        const find = await findBy("PROGRAMA", programa, true, view, page, limit);

        if (!find) {
            return findBy("PROGRAMA", programa, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Valida a existência de um associado pelo ID.
     */
    findID_ASSOCIADO(id) {
        return findBy("ID", id, false, "associado");
    };

    /**
     * Valida a existência de um programa pelo ID.
     */
    findID_PROGRAMA(id) {
        return findBy("ID", id, false, "programa");
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
     * Consulta pelo dap limitando por escopo.
     */
    async findByDapScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Consulta pelo programa limitando por escopo.
     */
    async findByProgramaScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };
        
        return find;
    };

    /**
     * Cria um novo registro de agricultura familiar.
     */
    createAgriculturaFamiliar(data) {
        return insertData(data, table);
    };

    /**
     * Atualiza um registro existente de agricultura familiar.
     */
    updateAgriculturaFamiliar(id, data) {
        return updateData(id, data, table);
    };

    /**
     * Remove um registro de agricultura familiar.
     */
    deleteAgriculturaFamiliar(id) {
        return deleteData(id, table);
    };
};

module.exports = new AgriculturaFamiliarRepository();