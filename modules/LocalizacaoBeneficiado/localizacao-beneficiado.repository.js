// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData, findWithScope } = require("../../shared/Utils/dbUtils");
const table = "localizacao_beneficiada";
const view = "view_localizacao_beneficiado";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class LocalizacaoBeneficiadoRepository {

    /**
     * Retorna todas as localizações beneficiadas.
     */

    async findAllLocalizacao(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma localização beneficiada pelo ID.
     */

    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma localização beneficiada pelo ID.
     */

    async findByIdAssociacao(id, page, limit) {
        const find = await findBy("ID_ASSOCIACAO", id, true, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIACAO", id, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma localização beneficiada pelo ID da secretaria.
     */

    async findByIdSecretaria(id, page, limit) {
        const find = await findBy("ID_SECRETARIA", id, false, view, page, limit);

        if (!find) {
            return findBy("ID_SECRETARIA", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca uma localização beneficiada pelo ID da pessoa.
     */

   async findByIdPessoa(id) {
        const find = await findBy("ID_PESSOA", id, false, view, 1, 1);

        if (!find) {
            return findBy("ID_PESSOA", id, false, table, 1, 1);
        };

        return find;
    };

    /**
     * Busca uma localização beneficiada pelo ID
     * para validação antes da exclusão.
     */

    async findByIdDelete(id) {
        const find = await findBy("ID", id, false, view, 1, 1);

        if (!find) {
            return findBy("ID", id, false, table, 1, 1);
        };

        return find;
    };

    /**
     * Busca localizações beneficiadas pelo nome.
     *
     * A busca é feita de forma parcial (LIKE).
     */

    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Busca localizações beneficiadas pelo id da associação.
     */

    async findbyIdAssociacao(associacao, page, limit) {
        const find = await findBy("ID_ASSOCIACAO", associacao, false, view, page, limit);

        if (!find) {
            return findBy("ID_ASSOCIACAO", associacao, false, table, page, limit);
        };

        return find;
    };

    /**
     * Busca localizações beneficiadas pela associação.
     */

    async findbyAssociacao(associacao) {
        const find = await findBy("ASSOCIACAO", associacao, true, view, 1, 1);

        if (!find) {
            return findBy("ASSOCIACAO", associacao, true, table, 1, 1);
        };

        return find;
    };

    /**
     * Valida a existência de um associado pelo ID.
     *
     * Utilizado principalmente para validações
     * antes de criar ou atualizar registros.
     */

    findID_ASSOCIADO(id) {
        return findBy("ID", id, false, "associado");
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
     * Consulta pelo ID_ASSOCIACAO limitando por escopo.
     */
    async findByIdAssociacaoScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo ID_ASSOCIACAO limitando por escopo.
     */
    async findByNameAssociacaoScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, true, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, true, table, page, limit);
        };

        return find;
    };

    /**
     * Cria uma nova localização beneficiada.
     *
     * Os dados são inseridos diretamente
     * na tabela correspondente.
     */

    createLocalizacao(localizacao) {
        return insertData(localizacao, table);
    };

    /**
     * Atualiza uma localização beneficiada existente.
     */

    updateLocalizacao(id, localizacao) {
        return updateData(id, localizacao, table);
    };

    /**
     * Remove uma localização beneficiada.
     */

    deleteLocalizacao(id) {
        return deleteData(id, table);
    };
};

module.exports = new LocalizacaoBeneficiadoRepository();