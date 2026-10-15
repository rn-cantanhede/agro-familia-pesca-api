const Erros = require("../../shared/errors/Errors");
const AgriculturaPolicy = require("./policies/agricultura.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const associadosRepository = require("../Associados/associados.repository");
const AgriculturaFamiliarRepository = require("./agricultura-familiar.repository");
const { findByIdName, find, findByScope } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Agricultura Familiar.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class AgriculturaFamiliarService {

    /**
     * Retorna todos os registros de agricultura familiar.
     */
    async findAllAgriculturaFamiliar(session, page, limit) {
        if (!AgriculturaPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: AgriculturaFamiliarRepository.findAllAgriculturaFamiliar,
            secretaria: AgriculturaFamiliarRepository.findByIdSecretaria,
            associacao: AgriculturaFamiliarRepository.findByIdAssociacao,
            usuario: AgriculturaFamiliarRepository.findByIdPessoa,
        });
    };

    /**
     * Busca um registro por ID ou por nome.
     */
    async find(value, session, page, limit) {
        if (!AgriculturaPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findById,
                    AgriculturaFamiliarRepository.findByName
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
                    AgriculturaFamiliarRepository.findByIdScope,
                    AgriculturaFamiliarRepository.findByNameScope
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
                    AgriculturaFamiliarRepository.findByIdScope,
                    AgriculturaFamiliarRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca registros pelo número do CAF.
     */
    async findbyCaf(caf, session, page, limit) {
        if (!AgriculturaPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    caf,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findbyCaf
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "CAF",
                    "CAF",
                    caf,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByCafScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "CAF",
                    "CAF",
                    caf,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByCafScope
                ),
        });
    };

    /**
     * Busca registros pelo número da DAP.
     */
    async findbyDap(dap, session, page, limit) {
        if (!AgriculturaPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    dap,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findbyDap
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "DAP",
                    "DAP",
                    dap,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByDapScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "DAP",
                    "DAP",
                    dap,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByDapScope
                ),
        });
    };

    /**
     * Busca registros vinculados a um programa específico.
     */
    async findbyPrograma(programa, session, page, limit) {
        if (!AgriculturaPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    programa,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findbyPrograma
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "PROGRAMA",
                    "PROGRAMA",
                    programa,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByProgramaScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "PROGRAMA",
                    "PROGRAMA",
                    programa,
                    page, 
                    limit,
                    AgriculturaFamiliarRepository.findByProgramaScope
                ),
        });
    };

    /**
     * Cria um novo registro de agricultura familiar.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_ASSOCIADO": "",
     *   "ID_PROGRAMA": "",
     *   "DAP": ""
     * }
     * 
     */
    async createAgriculturaFamiliar(data, user) {
        if (!AgriculturaPolicy.canPost(user)) {
            throw new Erros("Acesso negado", 403);
        };
        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [
            {
                field: "ID_ASSOCIADO",
                validation: AgriculturaFamiliarRepository.findID_ASSOCIADO,
                errorMsg: "ID_ASSOCIADO invalido"
            },
            {
                field: "ID_PROGRAMA",
                validation: AgriculturaFamiliarRepository.findID_PROGRAMA,
                errorMsg: "ID_PROGRAMA invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(data, validations);

        // Insere no banco de dados
        return await AgriculturaFamiliarRepository.createAgriculturaFamiliar(data);
    };

    /**
     * Atualiza um registro existente de agricultura familiar.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_ASSOCIADO": "",
     *   "ID_PROGRAMA": "",
     *   "DAP": ""
     * }
     * 
     */
    async updateAgriculturaFamiliar(id, data, user) {

        // Verifica se existe antes de atualizar
        const idAgri = await AgriculturaFamiliarRepository.findById(id);

        if (!idAgri) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AgriculturaPolicy.canUpdate(Alluser, idAgri.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas
        const validations = [
            {
                field: "ID_ASSOCIADO",
                validation: AgriculturaFamiliarRepository.findID_ASSOCIADO,
                errorMsg: "ID_ASSOCIADO invalido"
            },
            {
                field: "ID_PROGRAMA",
                validation: AgriculturaFamiliarRepository.findID_PROGRAMA,
                errorMsg: "ID_PROGRAMA invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(data, validations);

        // Aplica a atualização no banco de dados
        return await AgriculturaFamiliarRepository.updateAgriculturaFamiliar(id, data);
    };

    /**
     * Remove um registro de agricultura familiar.
     */
    async deleteAgriculturaFamiliar(id, user) {

        // Verifica se existe na tabela real antes de excluir
        const idAgri = await AgriculturaFamiliarRepository.findById(id);

        if (!idAgri) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AgriculturaPolicy.canDelete(Alluser, idAgri.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Remove definitivamente
        return await AgriculturaFamiliarRepository.deleteAgriculturaFamiliar(id);
    };
};

module.exports = new AgriculturaFamiliarService();