const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const AssociacoesService = require("./associacoes.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas as Associações e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class AssociacoesController {

    /**
     * Retorna todas as associações cadastradas.
     */
    async AllAssociacoes(req, res) {
        try {
            const associacoes = await AssociacoesService.findAllAssociacoes(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(associacoes.result)) {
                hateoas = Hateoas(
                    associacoes.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associacoes",
                    ["",
                        associacoes.result.ID,
                        convertString(associacoes.result.NOME),
                        `categoria/${convertString(associacoes.result.CATEGORIA)}`,
                        `secretaria/${convertString(associacoes.result.SECRETARIA)}`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    associacoes.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associacoes",
                    ["",
                        associacoes.result[0].ID,
                        convertString(associacoes.result[0].NOME),
                        `categoria/${convertString(associacoes.result[0].CATEGORIA)}`,
                        `secretaria/${convertString(associacoes.result[0].SECRETARIA)}`,
                    ]
                );
            };

            req.log.info({
                event: "ASSOCIACAO_LIST",
                resource: "associacao",
                action: "list",
                usuarioId: req.session.user.id
            }, "Listagem das associações");

            return res.status(200).json({
                result: associacoes.result,
                total: associacoes.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_LIST_ERROR",
                resource: "associacao",
                action: "list",
                usuarioId: req.session.user.id
            }, "Erro ao listar as associações");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca uma associação específica.
     */
    async findAssociacao(req, res, next) {
        try {
            const result = await AssociacoesService.find(
                req.params.value,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associacoes",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `categoria/${convertString(result.result.CATEGORIA)}`,
                        `secretaria/${convertString(result.result.SECRETARIA)}`,
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associacoes",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `categoria/${convertString(result.result[0].CATEGORIA)}`,
                        `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                    ]
                );
            };

            req.log.info({
                event: "ASSOCIACAO_FIND",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Associação consultada por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_FIND_ERROR",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar associação por id ou nome");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca associações filtradas por categoria.
     */
    async findCategoriaAssociacao(req, res, next) {
        try {
            const result = await AssociacoesService.findByCategoria(
                convertString(req.params.categoria),
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "associacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `categoria/${convertString(result.result[0].CATEGORIA)}`,
                    `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                ]
            );

            req.log.info({
                event: "ASSOCIACAO_FIND",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.categoria
            }, "Associação consultada por categoria");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_FIND_ERROR",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.categoria
            }, "Erro ao buscar associação por categoria");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca associações filtradas por secretaria.
     */
    async findSecretariaAssociacao(req, res, next) {
        try {
            const result = await AssociacoesService.findbySecretaria(
                req.params.secretaria,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "associacoes",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `categoria/${convertString(result.result[0].CATEGORIA)}`,
                    `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                ]
            );

            req.log.info({
                event: "ASSOCIACAO_FIND",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.secretaria
            }, "Associação consultada por secretaria");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_FIND_ERROR",
                resource: "associacao",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.secretaria
            }, "Erro ao buscar associação por secretaria");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria uma nova associação.
     */
    async createAssociacao(req, res, next) {
        try {
            await AssociacoesService.createAssociacao(
                req.body,
                req.session.user
            );
            const find = await AssociacoesService.find(
                req.body.NOME,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "associacoes",
                ["",
                    find.result[0].ID,
                    convertString(find.result[0].NOME),
                    `categoria/${convertString(find.result[0].CATEGORIA)}`,
                    `secretaria/${convertString(find.result[0].SECRETARIA)}`,
                ]
            );

            req.log.info({
                event: "ASSOCIACAO_CREATE",
                resource: "associacao",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Associação criada");

            res.status(201).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_CREATE_ERROR",
                resource: "associacao",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar associação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Atualiza uma associação existente.
     */
    async updateAssociacao(req, res, next) {
        try {
            const result = await AssociacoesService.updateAssociacao(
                req.params.id,
                req.body,
                req.session.user
            );
            const find = await AssociacoesService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "associacoes",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `categoria/${convertString(find.result.CATEGORIA)}`,
                    `secretaria/${convertString(find.result.SECRETARIA)}`,
                ]
            );

            req.log.info({
                event: "ASSOCIACAO_UPDATE",
                resource: "associacao",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Associação atualizada");

            res.status(200).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_UPDATE_ERROR",
                resource: "associacao",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar associação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Remove uma associação do sistema.
     */
    async deleteAssociacao(req, res, next) {
        try {
            const result = await AssociacoesService.deleteAssociacao(
                req.params.id,
                req.session.user
            );
            const hateoas = Hateoas(
                "",
                process.env.URL,
                req.session.user.nivel,
                "categorias",
                [""]
            );

            req.log.info({
                event: "ASSOCIACAO_DELETE",
                resource: "associacao",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Associação excluída");

            res.status(200).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIACAO_DELETE_ERROR",
                resource: "associacao",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar associação");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new AssociacoesController();