const Erros = require("../../shared/errors/Errors");
const AssociadosPolicy = require("./policies/associados.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const AssociadosRepository = require("./associados.repository");
const associadosRepository = require("./associados.repository");
const { find, findByInterval, findByIdName, findByScope, findByIntervalScope } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Associado.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class AssociadosService {

    /**
     * Retorna todos os associados cadastrados.
     */

    async findAllAssociados(session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: AssociadosRepository.findAllAssociados,
            secretaria: AssociadosRepository.findByIdSecretaria,
            associacao: AssociadosRepository.findbyIdAssociacao,
            usuario: AssociadosRepository.findById,
        });
    };

    /**
     * Busca associado por ID ou Nome, conforme o tipo de entrada.
     */

    async find(value, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    AssociadosRepository.findById,
                    AssociadosRepository.findByName
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
                    AssociadosRepository.findByIdScope,
                    AssociadosRepository.findByNameScope
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
                    AssociadosRepository.findByIdScope,
                    AssociadosRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca associado pelo CAF.
     */

    async findbyCaf(caf, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    caf,
                    page,
                    limit,
                    AssociadosRepository.findbyCaf
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
                    AssociadosRepository.findByCafScope
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
                    AssociadosRepository.findByCafScope
                ),
        });
    };

    /**
     * Busca associado pelo DAP.
     */

    async findbyDap(dap, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    dap,
                    page, 
                    limit,
                    AssociadosRepository.findbyDap
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
                    AssociadosRepository.findByDapScope
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
                    AssociadosRepository.findByDapScope
                ),
        });
    };

    /**
     * Lista associados filtrando pela associação.
     */

    async findbyAssociacao(associacao, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    associacao,
                    page, 
                    limit,
                    AssociadosRepository.findbyIdAssociacao,
                    AssociadosRepository.findbyAssociacao
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID_ASSOCIACAO",
                    "ASSOCIACAO",
                    associacao,
                    page, 
                    limit,
                    AssociadosRepository.findByIdScope,
                    AssociadosRepository.findByNameScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID_ASSOCIACAO",
                    "ASSOCIACAO",
                    associacao,
                    page, 
                    limit,
                    AssociadosRepository.findByIdScope,
                    AssociadosRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca associados pela data exata de validade do CAF.
     */

    async findbyData(data, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    data,
                    page, 
                    limit,
                    AssociadosRepository.findbyDataCaf
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "VALIDADE_CAF",
                    "VALIDADE_CAF",
                    data,
                    page, 
                    limit,
                    AssociadosRepository.findByDataCafScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "VALIDADE_CAF",
                    "VALIDADE_CAF",
                    data,
                    page, 
                    limit,
                    AssociadosRepository.findByDataCafScope
                ),
        });
    };

    /**
     * Busca associados por intervalo de validade do CAF.
     */

    async findByInicioFim(inicio, fim, session, page, limit) {
        if (!AssociadosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByInterval(
                    inicio,
                    fim,
                    page,
                    limit,
                    AssociadosRepository.findByInicioFimCaf
                ),

            secretaria: (id) =>
                findByIntervalScope(
                    id,
                    sessionField[0],
                    "VALIDADE_CAF",
                    inicio,
                    fim,
                    page,
                    limit,
                    AssociadosRepository.findByInicioFimCafScope,
                ),

            associacao: (id) =>
                findByIntervalScope(
                    id,
                    sessionField[1],
                    "VALIDADE_CAF",
                    inicio,
                    fim,
                    page,
                    limit,
                    AssociadosRepository.findByInicioFimCafScope,
                ),
        });
    };

    /**
     * Cria um associado após validar referências obrigatórias.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_PESSOA": "",
     *   "ID_ASSOCIACAO": "",
     *   "CAF": "",
     *   "VALIDADE_CAF": "",
     * }
     * 
     */

    async createAssociado(associado, user) {
        if (!AssociadosPolicy.canPost(user)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [
            {
                field: "ID_PESSOA",
                validation: AssociadosRepository.findID_PESSOA,
                errorMsg: "ID_PESSOA invalido"
            },
            {
                field: "ID_ASSOCIACAO",
                validation: AssociadosRepository.findID_ASSOCIACAO,
                errorMsg: "ID_ASSOCIACAO invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(associado, validations);

        // Insere no banco de dados
        return await AssociadosRepository.createAssociado(associado);
    };

    /**
     * Modifica um associado após validar referências obrigatórias.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_PESSOA": "",
     *   "ID_ASSOCIACAO": "",
     *   "CAF": "",
     *   "VALIDADE_CAF": "",
     * }
     * 
     */

    async updateAssociado(id, associado, user) {

        // Verifica se existe antes de atualizar
        const idAssociado = await AssociadosRepository.findId(id);

        if (!idAssociado) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AssociadosPolicy.canUpdate(Alluser, idAssociado.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas
        const validations = [
            {
                field: "ID_PESSOA",
                validation: AssociadosRepository.findID_PESSOA,
                errorMsg: "ID_PESSOA invalido"
            },
            {
                field: "ID_ASSOCIACAO",
                validation: AssociadosRepository.findID_ASSOCIACAO,
                errorMsg: "ID_ASSOCIACAO invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(associado, validations);

        // Aplica a atualização no banco de dados
        return await AssociadosRepository.updateAssociado(id, associado);
    };

    /**
     * Deleta um associado após validar o id.
     */

    async deleteAssociado(id, user) {
        // Verifica se existe antes de atualizar
        const idAssociado = await AssociadosRepository.findId(id);

        if (!idAssociado) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AssociadosPolicy.canUpdate(Alluser, idAssociado.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Remove definitivamente
        return await AssociadosRepository.deleteAssociado(id);
    };
};

module.exports = new AssociadosService();