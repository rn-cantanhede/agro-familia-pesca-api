// Importa as funções utilitárias responsáveis pelas operações básicas no banco de dados.
// padronizando as operações de CRUD na aplicação.
const { findAll, findBy, insertData, updateData, deleteData, loginDB, findWithScope } = require("../../shared/Utils/dbUtils");
const table = "usuario";
const view = "view_usuarios";

/**
 * Repositório responsável pelas operações de acesso a dados
 * relacionadas à usuarios.
 *
 * Centraliza todas as consultas, inserções, atualizações
 * e remoções referentes à localização.
 */
class UsuariosRepository {

    /**
     * Retorna todas os usuarios cadastradas.
     */
    async findAllUsuarios(page, limit) {
        const find = await findAll(view, page, limit);

        if (!find) {
            return findAll(table, page, limit);
        };

        return find;
    };

    /**
     * Consulta usuario pelo ID.
     */
    async findById(id, page, limit) {
        const find = await findBy("ID", id, false, view, page, limit);

        if (!find) {
            return findBy("ID", id, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta usuario pelo ID na tabela principal.
     */
    findByIdDelete(id) {
        return findBy("ID", id, false, table);
    }

    /**
     * Consulta usuario pelo nome.
     * Retorna múltiplos resultados.
     */
    async findByName(name, page, limit) {
        const find = await findBy("NOME", name, true, view, page, limit);

        if (!find) {
            return findBy("NOME", name, true, table, page, limit);
        };

        return find;
    };

    /**
     * Lista usuarios filtrando pelo nivel.
     */
    async findByNivel(nivel, page, limit) {
        const find = await findBy("NIVEL", nivel, false, view, page, limit);

        if (!find) {
            return findBy("NIVEL", nivel, false, table, page, limit);
        };

        return find;
    };

    /**
     * Lista usuarios filtrando pela secretaria.
     */
    async findBySecretaria(secretaria, page, limit) {
        const find = await findBy("SECRETARIA", secretaria, true, view, page, limit);

        if (!find) {
            return findBy("SECRETARIA", secretaria, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta usuarios pelo ID da secretaria.
     */
    async findByIdSecretaria(id) {
        const find = await findBy("ID_SECRETARIA", id, false, view);

        if (!find) {
            return findBy("ID_SECRETARIA", id, false, table);
        };

        return find;
    };

    /**
     * Consulta usuarios pelo ID da pessoa.
     */
    async findByIdPessoa(id) {
        const find = await findBy("ID_PESSOA", id, false, view);

        if (!find) {
            return findBy("ID_PESSOA", id, false, table);
        };

        return find;
    };

    /**
     * Consulta usuarios pelo Id da associaçao.
     */
    async findByIdAssociacao(id) {
        const find = await findBy("ID_ASSOCIACAO", id, false, view);

        if (!find) {
            return findBy("ID_ASSOCIACAO", id, false, table);
        };

        return find;
    };

    /**
     * Consulta usuarios pela associaçao.
     */
    async findByAssociacao(associacao) {
        const find = await findBy("ASSOCIACAO", associacao, true, view);

        if (!find) {
            return findBy("ASSOCIACAO", associacao, true, table);
        };

        return find;
    };

    /**
     * Consulta usuarios pelo Login na view_usuarios.
     */
    async findByLogin(login, page, limit) {
        const find = await findBy("LOGIN", login, true, view, page, limit);

        if (!find) {
            return findBy("LOGIN", login, true, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo ID na view_usuarios limitando por escopo.
     */
    async findByIdScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, false, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo NOME na view_usuarios limitando por escopo.
     */
    async findByNameScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, false, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo nivel na view_usuarios limitando por escopo.
     */
    async findByNivelScope(sessionID, sessionField, fieldID, value, page, limit) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, false, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, false, table, page, limit);
        };

        return find;
    };

    /**
     * Consulta pelo Login na view_usuarios limitando por escopo.
     */
    async findByLoginScope(sessionID, sessionField, fieldID, value, page, limit,) {
        const find = await findWithScope(sessionID, sessionField, fieldID, value, false, view, page, limit);

        if (!find) {
            return findWithScope(sessionID, sessionField, fieldID, value, false, table, page, limit);
        };

        return find;
    };


    /**
     * Consulta ID_PESSOA pelo ID na tabela pessoa.
     */
    findByID_PESSOA(id) {
        return findBy("ID", id, false, "pessoa");
    };

    /**
     * Consulta ID_SECRETARIA pelo ID na tabela secretaria.
     */
    findByID_SECRETARIA(id) {
        return findBy("ID", id, false, "secretaria");
    };

    findForUpdate(id) {
        return findBy("ID", id, false, table);
    };

    /**
     * Insere um novo usuario.
     */
    createUsuario(usuario) {
        return insertData(usuario, table);
    };

    /**
     * Atualiza um usuario existente.
     */
    updateUsuario(id, usuario) {
        return updateData(id, usuario, table);
    };

    /**
     * Remove um usuario existente.
     */
    deleteUsuario(id) {
        return deleteData(id, table);
    };

    /**
     * Realiza a consulta de autenticação do usuário no banco de dados.
     */
    login(login) {
        return loginDB(login);
    };

    /**
     * Consulta sessão pelo ID na tabela sessoes.
     */
    findSession(sessionID) {
        return findBy("ID", sessionID, false, "SESSOES", 1, 1);
    };

    /**
     * Consulta sessão pelo REFRESH_TOKEN_HASH na tabela sessoes.
     */
    findSessionRefreshToken(refreshToken) {
        return findBy("REFRESH_TOKEN_HASH", refreshToken, false, "SESSOES", 1, 1);
    };

    /**
     * Consulta sessão pelo ID_PESSOA na tabela sessoes.
     */
    findSessionByIdPessoa(id) {
        return findBy("ID_PESSOA", id, false, "SESSOES", 1, 1);
    };

    /**
     * Insere uma nova sessão.
     */
    createSession(session) {
        return insertData(session, "SESSOES");
    };

    /**
     * Atualiza uma sessão existente.
     */
    updateSession(id, session) {
        return updateData(id, session, "SESSOES");
    };

    /**
     * Remove uma sessão existente.
     */
    deleteSession(id) {
        return deleteData(id, "SESSOES");
    };
};

module.exports = new UsuariosRepository();