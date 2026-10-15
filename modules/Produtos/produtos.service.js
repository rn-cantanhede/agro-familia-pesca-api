const Erros = require("../../shared/errors/Errors");
const ProdutosPolicy = require("./policies/produtos.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const ProdutosRepository = require("./produtos.repository");
const associadosRepository = require("../Associados/associados.repository");
const { findByIdName } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Produto.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class ProdutosService {
    /**
     * Retorna a lista completa de produtos.
     */

    async findAllProdutos(session, page, limit) {
        if (!ProdutosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: ProdutosRepository.findAllProdutos,
            secretaria: ProdutosRepository.findAllProdutos,
            associacao: ProdutosRepository.findAllProdutos,
            usuario: ProdutosRepository.findAllProdutos,
        });
    };

    /**
     * Busca um produto pelo ID ou pelo nome.
     */

    async find(value, session, page, limit) {
        if (!ProdutosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    ProdutosRepository.findById,
                    ProdutosRepository.findByName
                ),

            secretaria: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    ProdutosRepository.findById,
                    ProdutosRepository.findByName
                ),

            associacao: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    ProdutosRepository.findById,
                    ProdutosRepository.findByName
                ),
            usuario: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    ProdutosRepository.findById,
                    ProdutosRepository.findByName
                ),
        });
    };

    /**
     * Cria um novo produto após validação das dependências.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "ID_TIPO_PRODUTO": ""
     * }
     * 
     */

    async createProduto(produto, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!ProdutosPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [
            {
                field: "ID_TIPO_PRODUTO",
                validation: ProdutosRepository.findID_TIPO_PRODUTO,
                errorMsg: "ID_TIPO_PRODUTO inválido"
            },
        ];

        // Executa todas as validações definidas
        await validationsUtils.validate(produto, validations);

        // Insere no banco de dados
        return await ProdutosRepository.createProduto(produto);
    };

    /**
     * Atualiza um produto existente.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "ID_TIPO_PRODUTO": ""
     * }
     * 
     */

    async updateProduto(id, produto, user) {
        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!ProdutosPolicy.canUpdate(Alluser, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        const validations = [
            {
                field: "ID_TIPO_PRODUTO",
                validation: ProdutosRepository.findID_TIPO_PRODUTO,
                errorMsg: "ID_TIPO_PRODUTO inválido"
            },
        ];

        // Valida dependências antes da inserção
        await validationsUtils.validate(produto, validations);

        // Aplica a atualização no banco de dados
        return await ProdutosRepository.updateProduto(id, produto);
    };

    /**
     * Remove um produto pelo ID.
     */

    async deleteProduto(id, user) {
        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };


        if (!ProdutosPolicy.canUpdate(Alluser, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Verifica se existe na tabela real antes de excluir
        const idProduto = await ProdutosRepository.findById(id);

        if (!idProduto) {
            throw new Erros("ID não existe", 404);
        };
        
        // Remove definitivamente
        return await ProdutosRepository.deleteProduto(id);
    };
};

module.exports = new ProdutosService();