const Erros = require("../../shared/errors/Errors");
const BaseService = require("../../shared/base/BaseService");
const AssociacoesPolicy = require("./policies/associacoes.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const pessoasRepository = require("../Pessoas/pessoas.repository");
const AssociacoesRepository = require("./associacoes.repository");
const { findByIdName, find, findByScope } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Associação.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class AssociacoesService {

    /**
     * Retorna todas as associações cadastradas.
     */
    async findAllAssociacoes(session, page, limit) {
        if (!AssociacoesPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: AssociacoesRepository.findAllAssociacoes,
            secretaria: AssociacoesRepository.findbyIdSecretaria,
            associacao: AssociacoesRepository.findById,
            usuario: AssociacoesRepository.findById
        });
    };

    /**
     * Busca uma associação por ID ou por nome.
     */
    async find(value, session, page, limit) {
        if (!AssociacoesPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    AssociacoesRepository.findById,
                    AssociacoesRepository.findByName
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
                    AssociacoesRepository.findByIdScope,
                    AssociacoesRepository.findByNameScope
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
                    AssociacoesRepository.findByIdScope,
                    AssociacoesRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca associações vinculadas a uma categoria específica.
     */
    async findByCategoria(categoria, session, page, limit) {
        if (!AssociacoesPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    categoria, 
                    page, 
                    limit,
                    AssociacoesRepository.findbyCategoria
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "CATEGORIA",
                    "CATEGORIA",
                    categoria,
                    page, 
                    limit,
                    AssociacoesRepository.findByCategoriaScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "CATEGORIA",
                    "CATEGORIA",
                    categoria,
                    page, 
                    limit,
                    AssociacoesRepository.findByCategoriaScope
                ),
        });
    };

    /**
     * Busca associações vinculadas a uma secretaria específica.
     */
    async findbySecretaria(secretaria, session, page, limit) {
        if (!AssociacoesPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    secretaria,
                    page, 
                    limit,
                    AssociacoesRepository.findbyIdSecretaria,
                    AssociacoesRepository.findbySecretaria
                ),
        });
    };

    /**
     * Cria uma nova associação.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "ENDERECO": "",
     *   "ID_CATEGORIA": "",
     *   "ID_SECRETARIA": "",
     * }
     * 
     */
    async createAssociacao(associacao, user) {
        if (!AssociacoesPolicy.canPost(user)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [
            {
                field: "ID_SECRETARIA",
                validation: AssociacoesRepository.findID_SECRETARIA,
                errorMsg: "ID_SECRETARIA invalido"
            },
            {
                field: "ID_CATEGORIA",
                validation: AssociacoesRepository.findID_CATEGORIA,
                errorMsg: "ID_CATEGORIA invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(associacao, validations);

        // Insere no banco de dados
        return await AssociacoesRepository.createAssociacao(associacao);
    };

    /**
     * Atualiza os dados de uma associação existente.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "ENDERECO": "",
     *   "ID_CATEGORIA": "",
     *   "ID_SECRETARIA": "",
     * }
     * 
     */

    async updateAssociacao(id, associacao, user) {

        // Verifica se existe antes de atualizar
        const idAssociacao = await AssociacoesRepository.findById(id);

        if (!idAssociacao) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await pessoasRepository.findId(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AssociacoesPolicy.canUpdate(Alluser, idAssociacao.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas
        const validations = [
            {
                field: "ID_SECRETARIA",
                validation: AssociacoesRepository.findID_SECRETARIA,
                errorMsg: "ID_SECRETARIA invalido"
            },
            {
                field: "ID_CATEGORIA",
                validation: AssociacoesRepository.findID_CATEGORIA,
                errorMsg: "ID_CATEGORIA invalido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(associacao, validations);

        // Aplica a atualização no banco de dados
        return await AssociacoesRepository.updateAssociacao(id, associacao);
    };

    /**
     * Remove uma associação do banco de dados.
     */
    async deleteAssociacao(id, user) {

        // Verifica se existe na tabela real antes de excluir
        const idAssociacao = await AssociacoesRepository.findByIdDelete(id);

        if (!idAssociacao) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await pessoasRepository.findId(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!AssociacoesPolicy.canUpdate(Alluser, idAssociacao.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Remove definitivamente
        return await AssociacoesRepository.deleteAssociacao(id);
    };
};

module.exports = new AssociacoesService();