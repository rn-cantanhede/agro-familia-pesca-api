const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const MovimentacoesService = require("./movimentacoes.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas as Movimentações e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class MovimentacoesController {

    /**
     * Retorna todas as movimentações cadastradas.
     */

    async AllMovimentacoes(req, res) {
        try {
            const movimentacoes = await MovimentacoesService.findAllMovimentacoes(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(movimentacoes.result)) {
                hateoas = Hateoas(
                    movimentacoes.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "movimentacoes",
                    ["",
                        movimentacoes.result.ID,
                        `dap/${movimentacoes.result.DAP}`,
                        `produto/${convertString(movimentacoes.result.PRODUTO)}`,
                        `data/${movimentacoes.result.DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-01-10/2025-05-05`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    movimentacoes.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "movimentacoes",
                    ["",
                        movimentacoes.result[0].ID,
                        `dap/${movimentacoes.result[0].DAP}`,
                        `produto/${convertString(movimentacoes.result[0].PRODUTO)}`,
                        `data/${movimentacoes.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-01-10/2025-05-05`,
                    ]
                );
            };

            req.log.info({
                event: "MOVIMENTACAO_LIST",
                resource: "produto_movimentacao",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem das movimentações");

            return res.status(200).json({
                result: movimentacoes.result,
                total: movimentacoes.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_LIST_ERROR",
                resource: "produto_movimentacao",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar as movimentações");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca uma movimentação pelo ID.
     */

    async findByIdMovimentacoes(req, res, next) {
        try {
            const result = await MovimentacoesService.findById(
                req.params.id,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "movimentacoes",
                ["",
                    result.result[0].ID,
                    `dap/${result.result[0].DAP}`,
                    `produto/${convertString(result.result[0].PRODUTO)}`,
                    `data/${result.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-01-10/2025-05-05`,
                ]
            );

            req.log.info({
                event: "MOVIMENTACAO_FIND",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.id
            }, "Movimentação consultada por ID");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_FIND_ERROR",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.id
            }, "Erro ao buscar movimentação por ID");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca movimentações associadas a um DAP específico.
     */

    async findDapMovimentacoes(req, res, next) {
        try {
            const result = await MovimentacoesService.findbyDap(
                req.params.dap,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "movimentacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `dap/${result.result[0].DAP}`,
                    `produto/${convertString(result.result[0].PRODUTO)}`,
                    `data/${result.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-01-10/2025-05-05`,
                ]
            );

            req.log.info({
                event: "MOVIMENTACAO_FIND",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Movimentação consultada por DAP");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_FIND_ERROR",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Erro ao buscar movimentação por DAP");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca movimentações relacionadas a um produto específico.
     */

    async findProdutoMovimentacoes(req, res, next) {
        try {
            const result = await MovimentacoesService.findbyProduto(
                req.params.produto,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "movimentacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `dap/${result.result[0].DAP}`,
                    `produto/${convertString(result.result[0].PRODUTO)}`,
                    `data/${result.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-01-10/2025-05-05`,
                ]
            );

            req.log.info({
                event: "MOVIMENTACAO_FIND",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.produto
            }, "Movimentação consultada por produto");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_FIND_ERROR",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.produto
            }, "Erro ao buscar movimentação por produto");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca movimentações realizadas em uma data específica.
     */

    async findDataMovimentacoes(req, res, next) {
        try {
            const result = await MovimentacoesService.findbyData(
                req.params.data,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "movimentacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `dap/${result.result[0].DAP}`,
                    `produto/${convertString(result.result[0].PRODUTO)}`,
                    `data/${result.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-01-10/2025-05-05`,
                ]
            );

            req.log.info({
                event: "MOVIMENTACAO_FIND",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.data
            }, "Movimentação consultada por data");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_FIND_ERROR",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.data
            }, "Erro ao buscvar movimentação por data");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca movimentações dentro de um intervalo de datas.
     */

    async findInicioFimMovimentacoes(req, res, next) {
        try {
            const result = await MovimentacoesService.findByInicioFim(
                req.params.inicio,
                req.params.fim,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "movimentacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `dap/${result.result[0].DAP}`,
                    `produto/${convertString(result.result[0].PRODUTO)}`,
                    `data/${result.result[0].DATA_MOVIMENTACAO.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-01-10/2025-05-05`,
                ]
            );

            req.log.info({
                event: "MOVIMENTACAO_FIND",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Movimentação consultada por um intervalo de datas");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_FIND_ERROR",
                resource: "produto_movimentacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Movimentação consultada por um intervalo de datas");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria uma nova movimentação.
     */

    async createMovimentacao(req, res, next) {
        try {
            const result = await MovimentacoesService.createMovimentacao(
                req.body,
                req.session.user
            );

            req.log.info({
                event: "MOVIMENTACAO_CREATE",
                resource: "produto_movimentacao",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Movimentação criada");

            res.status(201).json(result);
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_CREATE_ERROR",
                resource: "produto_movimentacao",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar movimentação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Atualiza uma movimentação existente.
     */

    async updateMovimentacao(req, res, next) {
        try {
            const result = await MovimentacoesService.updateMovimentacao(
                req.params.id,
                req.body,
                req.session.user
            );

            req.log.info({
                event: "MOVIMENTACAO_UPDATE",
                resource: "produto_movimentacao",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Movimentação atualizada");

            res.status(200).json(result);
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_UPDATE_ERROR",
                resource: "produto_movimentacao",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar movimentação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Remove uma movimentação do sistema.
     */

    async deleteMovimentacao(req, res, next) {
        try {
            const result = await MovimentacoesService.deleteMovimentacao(
                req.params.id,
                req.session.user
            );

            req.log.info({
                event: "MOVIMENTACAO_DELETE",
                resource: "produto_movimentacao",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Movimentação excluída");

            res.status(200).json(result);
        } catch (error) {
            req.log.error({
                event: "MOVIMENTACAO_DELETE_ERROR",
                resource: "produto_movimentacao",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar movimentação");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new MovimentacoesController();