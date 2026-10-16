const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const AssociadosService = require("./associados.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas as Categorias e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class AssociadosController {

    /**
     * Retorna todos os associados.
     */

    async AllAssociados(req, res) {
        try {
            const view = await AssociadosService.findAllAssociados(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(view.result)) {
                hateoas = Hateoas(
                    view.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associados",
                    ["",
                        view.result.ID,
                        convertString(view.result.NOME),
                        `caf/${view.result.CAF}`,
                        `dap/${view.result.DAP}`,
                        `associacao/${convertString(view.result.ASSOCIACAO)}`,
                        `data/${view.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-10-10/2026-05-20`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    view.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associados",
                    ["",
                        view.result[0].ID,
                        convertString(view.result[0].NOME),
                        `caf/${view.result[0].CAF}`,
                        `dap/${view.result[0].DAP}`,
                        `associacao/${convertString(view.result[0].ASSOCIACAO)}`,
                        `data/${view.result[0].VALIDADE_CAF.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-10-10/2026-05-20`,
                    ]
                );
            };

            req.log.info({
                event: "ASSOCIADO_LIST",
                resource: "associado",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem dos associados");

            return res.status(200).json({
                result: view.result,
                total: view.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_LIST_ERROR",
                resource: "associado",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar os associados");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca associado por ID ou Nome.
     */

    async findAssociado(req, res, next) {
        try {
            const result = await AssociadosService.find(
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
                    "associados",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `caf/${result.result.CAF}`,
                        `dap/${result.result.DAP}`,
                        `associacao/${convertString(result.result.ASSOCIACAO)}`,
                        `data/${result.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-10-10/2026-05-20`,
                    ]
                );

            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "associados",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `caf/${result.result[0].CAF}`,
                        `dap/${result.result[0].DAP}`,
                        `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                        `data/${result.result[0].VALIDADE_CAF.toISOString().split('T')[0]}`,
                        `data/intervalo/2025-10-10/2026-05-20`,
                    ]
                );
            };

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Associado consultado por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar associado por id ou nome");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca associado pelo CAF.
     */

    async findCafAssociado(req, res, next) {
        try {
            const result = await AssociadosService.findbyCaf(
                req.params.caf,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    result.result.ID,
                    convertString(result.result.NOME),
                    `caf/${result.result.CAF}`,
                    `dap/${result.result.DAP}`,
                    `associacao/${convertString(result.result.ASSOCIACAO)}`,
                    `data/${result.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.caf
            }, "Associado consultado por CAF");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.caf
            }, "Erro ao buscar associado por CAF");

            console.log(error);
            return next(error)
        };
    };

    /**
     * Busca associado pelo DAP.
     */

    async findDapAssociado(req, res, next) {
        try {
            const result = await AssociadosService.findbyDap(
                req.params.dap,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    result.result.ID,
                    convertString(result.result.NOME),
                    `caf/${result.result.CAF}`,
                    `dap/${result.result.DAP}`,
                    `associacao/${convertString(result.result.ASSOCIACAO)}`,
                    `data/${result.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Associado consultado por DAP");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Erro ao buscar associado por DAP");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Lista associados filtrando pela associação.
     */

    async findAssociacaoAssociado(req, res, next) {
        try {
            const result = await AssociadosService.findbyAssociacao(
                req.params.associacao,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `caf/${result.result[0].CAF}`,
                    `dap/${result.result[0].DAP}`,
                    `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                    `data/${result.result[0].VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.associacao
            }, "Associado consultado por associação");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Erro ao buscar associado por associação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca associados pela data de validade do CAF.
     */

    async findDataAssociado(req, res, next) {
        try {
            const result = await AssociadosService.findbyData(
                req.params.data,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `caf/${result.result[0].CAF}`,
                    `dap/${result.result[0].DAP}`,
                    `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                    `data/${result.result[0].VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.data
            }, "Associado consultado por data de validade do CAF");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.data
            }, "Erro ao buscar associado por data de validade do CAF");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca associados por intervalo de validade do CAF.
     */

    async findInicioFimAssociado(req, res, next) {
        try {
            const result = await AssociadosService.findByInicioFim(
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
                "associados",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `caf/${result.result[0].CAF}`,
                    `dap/${result.result[0].DAP}`,
                    `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                    `data/${result.result[0].VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_FIND",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Associado consultado por intervalo de validade do CAF");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_FIND_ERROR",
                resource: "associado",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Erro ao buscar associado por intervalo de validade do CAF");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria um novo associado.
     */

    async createAssociado(req, res, next) {
        try {
            await AssociadosService.createAssociado(
                req.body,
                req.session.user
            );
            const find = await AssociadosService.find(
                req.body.ID_PESSOA,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `caf/${find.result.CAF}`,
                    `dap/${find.result.DAP}`,
                    `associacao/${convertString(find.result.ASSOCIACAO)}`,
                    `data/${find.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_CREATE",
                resource: "associado",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Associado criado");

            res.status(201).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_CREATE_ERROR",
                resource: "associado",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar associado");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Modifica um associado.
     */

    async updateAssociado(req, res, next) {
        try {
            await AssociadosService.updateAssociado(
                req.params.id,
                req.body,
                req.session.user
            );
            const find = await AssociadosService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "associados",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `caf/${find.result.CAF}`,
                    `dap/${find.result.DAP}`,
                    `associacao/${convertString(find.result.ASSOCIACAO)}`,
                    `data/${find.result.VALIDADE_CAF.toISOString().split('T')[0]}`,
                    `data/intervalo/2025-10-10/2026-05-20`,
                ]
            );

            req.log.info({
                event: "ASSOCIADO_UPDATE",
                resource: "associado",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Associado atualizado");

            res.status(200).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_UPDATE_ERROR",
                resource: "associado",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar associado");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Deleta um associado.
     */

    async deleteAssociado(req, res, next) {
        try {
            const result = await AssociadosService.deleteAssociado(
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
                event: "ASSOCIADO_DELETE",
                resource: "associado",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Associado excluído");

            res.status(200).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "ASSOCIADO_DELETE_ERROR",
                resource: "associado",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar associado");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new AssociadosController();