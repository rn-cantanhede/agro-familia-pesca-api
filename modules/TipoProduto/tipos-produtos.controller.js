const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const TiposProdutosService = require("./tipos-produtos.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas aos Tipos de produtos e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class TipoProdutoController {

    /**
     * Retorna todos os tipos de produto.
     */

    async findallTipoProduto(req, res) {
        try {
            const tipos = await TiposProdutosService.findallTipoProduto(
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            let hateoas;

            if (!Array.isArray(tipos.result)) {
                hateoas = Hateoas(
                    tipos.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                    ["",
                        tipos.result.ID,
                        convertString(tipos.result.NOME)
                    ]
                );
            } else {
                hateoas = Hateoas(
                    tipos.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                    ["",
                        tipos.result[0].ID,
                        convertString(tipos.result[0].NOME)
                    ]
                );
            };
            
            req.log.info({
                event: "TIPO_LIST",
                resource: "tipo-produto",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem de tipos de produtos");

            return res.status(200).json({
                result: tipos.result,
                total: tipos.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "TIPO_LIST_ERROR",
                resource: "tipo-produto",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar tipos de produtos");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca tipo de produto por ID ou Nome.
     */

    async findTipoProduto(req, res, next) {
        try {
            const result = await TiposProdutosService.find(
                req.params.value,
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID, process.env.URL, req.session.user.nivel, "tipo-produto",
                    [
                        "", result.result.ID, convertString(result.result.NOME)
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID, process.env.URL, req.session.user.nivel, "tipo-produto",
                    [
                        "", result.result[0].ID, convertString(result.result[0].NOME),
                    ]
                );
            };

            req.log.info({
                event: "TIPO_FIND",
                resource: "tipo-produto",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Tipo de produto consultado por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "TIPO_FIND_ERROR",
                resource: "tipo-produto",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar tipo de produto");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria um novo tipo de produto.
     */

    async insertCategoria(req, res, next) {
        try {
            const result = await TiposProdutosService.insertCategoria(
                req.body,
                req.session.user
            );
            const hateoas = Hateoas(
                "", process.env.URL, req.session.user.nivel, "tipo-produto",
                [
                    "", convertString(result.NOME)
                ]
            );

            req.log.info({
                event: "TIPO_CREATE",
                resource: "tipo-produto",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Tipo de produto criado");

            return res.status(201).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET
                }
            });
        } catch (error) {
            req.log.error({
                event: "TIPO_CREATE_ERROR",
                resource: "tipo-produto",
                action: "create",
                usuarioId: req.session.user.id
            }, "Erro ao criar tipo de produto");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Atualiza um tipo de produto existente.
     */

    async updateCategoria(req, res, next) {
        try {
            const result = await TiposProdutosService.updateCategoria(
                req.params.id,
                req.body,
                req.session.user
            );
            const hateoas = Hateoas(
                req.params.id, process.env.URL, req.session.user.nivel, "tipo-produto",
                [
                    "", convertString(result.NOME)
                ]
            );

            req.log.info({
                event: "TIPO_UPDATE",
                resource: "tipo-produto",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Tipo de produto atualizado");

            return res.status(200).json({
                result: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "TIPO_UPDATE_ERROR",
                resource: "tipo-produto",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar tipo de produto");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Remove um tipo de produto existente.
     */

    async deleteTipoProduto(req, res, next) {
        try {
            const result = await TiposProdutosService.deleteTipoProduto(
                req.params.id,
                req.session.user
            );
            const hateoas = Hateoas("id", process.env.URL, req.session.user.nivel, "tipo-produto",
                ["", "id", "nome"]
            );

            req.log.info({
                event: "TIPO_DELETE",
                resource: "tipo-produto",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Tipo de produto excluído");

            return res.status(200).json({
                Message: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "TIPO_DELETE_ERROR",
                resource: "tipo-produto",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar tipo de produto");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new TipoProdutoController();