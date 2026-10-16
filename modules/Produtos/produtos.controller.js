const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const ProdutosService = require("./produtos.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas aos Produtos e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class ProdutosController {
    /**
     * Retorna a lista completa de produtos.
     */

    async AllProdutos(req, res) {
        try {
            const produtos = await ProdutosService.findAllProdutos(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(produtos.result)) {
                hateoas = Hateoas(
                    produtos.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                    ["",
                        produtos.result.ID,
                        convertString(produtos.result.NOME),
                    ]
                )
            } else {
                hateoas = Hateoas(
                    produtos.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                    ["",
                        produtos.result[0].ID,
                        convertString(produtos.result[0].NOME),
                    ]
                );
            };

            req.log.info({
                event: "PRODUTO_LIST",
                resource: "produto",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem dos produtos");

            return res.status(200).json({
                result: produtos.result,
                total: produtos.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PRODUTO_LIST_ERROR",
                resource: "produto",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar os produtos");

            console.error(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca produtos pelo ID ou pelo nome.
     */

    async findProdutos(req, res, next) {
        try {
            const produtos = await ProdutosService.find(
                req.params.value,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(produtos.result)) {
                hateoas = Hateoas(
                    produtos.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "produtos",
                    ["",
                        produtos.result.ID,
                        convertString(produtos.result.NOME),
                    ]
                );
            } else {
                hateoas = Hateoas(
                    produtos.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "produtos",
                    ["",
                        produtos.result[0].ID,
                        convertString(produtos.result[0].NOME),
                    ]
                );
            };

            req.log.info({
                event: "PRODUTO_FIND",
                resource: "produto",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Produto consultado por id ou nome");

            return res.status(200).json({
                result: produtos.result,
                total: produtos.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PRODUTO_FIND_ERROR",
                resource: "produto",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar produto");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Cria um novo produto.
     */

    async createProduto(req, res, next) {
        try {
            const result = await ProdutosService.createProduto(
                req.body,
                req.session.user
            );
            const find = await ProdutosService.find(
                result.NOME,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "produtos",
                ["",
                    find.result[0].ID,
                    convertString(find.result[0].NOME),
                ]
            );

            req.log.info({
                event: "PRODUTO_CREATE",
                resource: "produto",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Produto criado");

            return res.status(201).json({
                result: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PRODUTO_CREATE_ERROR",
                resource: "produto",
                action: "create",
                usuarioId: req.session.user.id
            }, "Erro ao criar produto");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Atualiza um produto existente.
     */

    async updateProduto(req, res, next) {
        try {
            const result = await ProdutosService.updateProduto(
                req.params.id,
                req.body,
                req.session.user
            );
            const find = await ProdutosService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "produtos",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                ]
            );

            req.log.info({
                event: "PRODUTO_UPDATE",
                resource: "produto",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Produto atualizada");

            return res.status(200).json({
                result: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PRODUTO_UPDATE_ERROR",
                resource: "produto",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar produto");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Remove um produto pelo ID.
     */

    async deleteProduto(req, res, next) {
        try {
            const find = await ProdutosService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const result = await ProdutosService.deleteProduto(
                req.params.id,
                req.session.user
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "produtos",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                ]
            );

            req.log.info({
                event: "PRODUTO_DELETE",
                resource: "produto",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Produto excluído");

            return res.status(200).json({
                result: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PRODUTO_DELETE_ERROR",
                resource: "produto",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar produto");

            console.error(error);
            return next(error);
        };
    };
};

module.exports = new ProdutosController();