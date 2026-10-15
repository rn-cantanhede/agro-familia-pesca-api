// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData } = require("../../shared/Utils/dbUtils");
const table = "secretaria";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à localização dos beneficiados.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */

class SecretariasRepository {

    /**
     * Retorna todas as secretarias cadastradas.
     */

    findAllSecretarias(page, limit) {
        return findAll(table, page, limit);
    };

    /**
     * Consulta secretaria pelo ID.
     */

    findById(id, page, limit) {
        return findBy("ID", id, false, table, page, limit);
    };

    /**
     * Consulta secretarias pelo nome.
     * Retorna múltiplos resultados.
     */

    findByName(name, page, limit) {
        return findBy("NOME", name, true, table, page, limit);
    };

    /**
     * Lista secretarias filtrando pelo estado.
     */

    findbyEstado(estado, page, limit) {
        return findBy("ESTADO", estado, true, table, page, limit);
    };

    /**
     * Lista secretarias filtrando pela cidade.
     */

    findbyCidade(cidade, page, limit) {
        return findBy("CIDADE", cidade, true, table, page, limit);
    };

    /**
     * Insere uma nova secretaria.
     */

    createSecretaria(data) {
        return insertData(data, table);
    };

    /**
     * Atualiza uma secretaria existente.
     */

    updateSecretaria(id, secretaria) {
        return updateData(id, secretaria, table);
    };

    /**
     * Remove uma secretaria existente.
     */
    
    deleteSecretaria(id) {
        return deleteData(id, table);
    };
};

module.exports = new SecretariasRepository();