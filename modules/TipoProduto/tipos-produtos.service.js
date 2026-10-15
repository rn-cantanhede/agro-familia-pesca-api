const Erros = require("../../shared/errors/Errors");
const TiposProdutosPolicy = require("./policies/tipos-produtos.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const TiposProdutosRepository = require("./tipos-produtos.repository");
const { findByIdName } = require("../../shared/Utils/findUtils");
const associadosRepository = require("../Associados/associados.repository");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade  produto.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class TiposProdutosService {

    /**
     * Retorna todos os tipos de produto cadastrados com filtro de escopo.
     */
    async findallTipoProduto(session, page, limit) {
        if (!TiposProdutosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };
        return await TiposProdutosRepository.findallTipoProduto(page, limit);
    };

    /**
     * Busca tipo de produto por ID ou Nome.
     */
    async find(value, session, page, limit) {
        if (!TiposProdutosPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return await findByIdName(
            value,
            page,
            limit,
            TiposProdutosRepository.findById,
            TiposProdutosRepository.findByName
        );
    };

    /**
     * Insere um novo tipo de produto.
     */
    async insertCategoria(data, user) {

        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);
        if (!TiposProdutosPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        const validations = [];
        await validationsUtils.validate(data, validations);

        return await TiposProdutosRepository.insertCategoria(data);
    };

    /**
     * Atualiza um tipo de produto existente.
     */
    async updateCategoria(id, data, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!TiposProdutosPolicy.canUpdate(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        const validations = [];
        await validationsUtils.validate(data, validations);

        return await TiposProdutosRepository.updateCategoria(id, data);
    };

    /**
     * Remove um tipo de produto existente.
     */
    async deleteTipoProduto(id, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!TiposProdutosPolicy.canDelete(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        return await TiposProdutosRepository.deleteTipoProduto(id);
    };
};

module.exports = new TiposProdutosService();