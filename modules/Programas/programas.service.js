const Erros = require("../../shared/errors/Errors");
const { findByIdName, findByScope } = require("../../shared/Utils/findUtils");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const ProgramasRepository = require("./programas.repository");
const baseScope = require("../../shared/base/baseScope");
const ProgramasPolicy = require("./policies/programas.policy");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Programa.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class ProgramasService {

    /**
     * Retorna todos os programas.
     * O BaseService filtra o que o usuário não pode ver.
     */
    async findAllProgramas(session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: ProgramasRepository.findAllProgramas,
            secretaria: ProgramasRepository.findbyIdSecretaria,
            associacao: ProgramasRepository.findbyIdAssociacao,
            usuario: ProgramasRepository.findById
        });
    };

    /**
     * Busca um programa. O BaseService garante que se ele achar um 
     * ID que não pertence ao usuário, ele barra o acesso.
     */
    async find(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findById,
                    ProgramasRepository.findByName
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID",
                    "NOME",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID",
                    "NOME",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "ID",
                    "NOME",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),
        });
    };

    async findbySecretaria(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findById,
                    ProgramasRepository.findByName
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID_SECRETARIA",
                    "SECRETARIA",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID_SECRETARIA",
                    "SECRETARIA",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "ID_SECRETARIA",
                    "SECRETARIA",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByIdScope,
                    ProgramasRepository.findByNameScope
                ),
        });
    };

    async findbyEstado(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findbyEstado,
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ESTADO",
                    "ESTADO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByEstadoScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ESTADO",
                    "ESTADO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByEstadoScope,
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "ESTADO",
                    "ESTADO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByEstadoScope,
                ),
        });
    };

    async findbyOrigemRecurso(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findbyOrigemRecurso,
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ORIGEM_RECURSO",
                    "ORIGEM_RECURSO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByOrigemRecursoScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ORIGEM_RECURSO",
                    "ORIGEM_RECURSO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByOrigemRecursoScope,
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "ORIGEM_RECURSO",
                    "ORIGEM_RECURSO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByOrigemRecursoScope,
                ),
        });
    };

    async findbyDataInicio(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findbyDataInicio,
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "DATA_INICIO",
                    "DATA_INICIO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataInicioScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "DATA_INICIO",
                    "DATA_INICIO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataInicioScope,
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "DATA_INICIO",
                    "DATA_INICIO",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataInicioScope,
                ),
        });
    };

    async findbyDataFim(value, session, page, limit) {
        if (!ProgramasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    value,
                    page,
                    limit,
                    ProgramasRepository.findbyDataFim,
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "DATA_FIM",
                    "DATA_FIM",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataFimScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "DATA_FIM",
                    "DATA_FIM",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataFimScope,
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "DATA_FIM",
                    "DATA_FIM",
                    value,
                    page,
                    limit,
                    ProgramasRepository.findByDataFimScope,
                ),
        });
    };

    /**
     * Cria um novo programa, aplicando validações e hash de senha.
     * 
     * Formato passado no body:
     * 
     * {
     *  "NOME": "",
     *   "DESCRICAO": "",
     *   "DATA_INICIO": "",
     *   "DATA_FIM": "",
     *   "ORIGEM_RECURSO": "",
     *   "VLR_REPASSE": "",
     *   "ID_SECRETARIA": ""
     * }
     * 
     */

    async createPrograma(programa, user) {
        if (!ProgramasPolicy.canPost(user)) {
            throw new Erros("Acesso negado", 403);
        };

        if (user.nivel !== 1 && programa.ID_SECRETARIA !== user.secretaria) {
            throw new Erros("Você só pode criar programas para sua secretaria", 403);
        };

        await validationsUtils.validate(programa, []);
        return await ProgramasRepository.createPrograma(programa);
    };

    /**
     * Atualiza um programa existente, aplicando validações e hash de senha se necessário.
     * 
     * Formato passado no body:
     * 
     * {
     *  "NOME": "",
     *   "DESCRICAO": "",
     *   "DATA_INICIO": "",
     *   "DATA_FIM": "",
     *   "ORIGEM_RECURSO": "",
     *   "VLR_REPASSE": "",
     *   "ID_SECRETARIA": ""
     * }
     * 
     */

    async updatePrograma(id, programa, user) {
        const registroExistente = await ProgramasRepository.findById(id);

        if (!registroExistente) {
            throw new Erros("ID invalido", 404);
        };

        if (!ProgramasPolicy.canUpdate(user, registroExistente.result)) {
            throw new Erros("Acesso negado", 403);
        };

        await validationsUtils.validate(programa, []);
        return await ProgramasRepository.updatePrograma(id, programa);
    };

    /**
     * Remove um programa existente.
     */
    async deletePrograma(id, user) {
        const registroExistente = await ProgramasRepository.findById(id);

        if (!registroExistente) {
            throw new Erros("ID não existe", 404);
        };

        if (!ProgramasPolicy.canDelete(user, registroExistente.result)) {
            throw new Erros("Acesso negado", 403);
        };

        return await ProgramasRepository.deletePrograma(id);
    };
};

module.exports = new ProgramasService();