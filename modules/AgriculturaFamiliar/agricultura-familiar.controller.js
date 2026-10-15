const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const AgriculturaFamiliarService = require("./agricultura-familiar.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas as Agricultura familiar e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class AgriculturaFamiliarController {

    /**
     * Retorna todos os registros de agricultura familiar.
     */
    async AllAgriculturaFamiliar(req, res) {
        try {
            const result = await AgriculturaFamiliarService.findAllAgriculturaFamiliar(
                req.session.user,
                req.query.page,
                req.query.limit,
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "agricultura-familiar",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `caf/${result.result.CAF}`,
                        `dap/${result.result.DAP}`,
                        `programa/${convertString(result.result.PROGRAMA)}`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "agricultura-familiar",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `caf/${result.result[0].CAF}`,
                        `dap/${result.result[0].DAP}`,
                        `programa/${convertString(result.result[0].PROGRAMA)}`,
                    ]
                );
            };

            req.log.info({
                event: "AGRICULTURA_LIST",
                resource: "agricultura_familiar",
                action: "list",
                usuarioId: req.session.user.id
            }, "Listagem dos membros da agricultura familiar");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.Error({
                event: "AGRICULTURA_LIST_ERROR",
                resource: "agricultura_familiar",
                action: "list",
                usuarioId: req.session.user.id
            }, "Erro ao listar os membros da agricultura familiar");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca registros de agricultura familiar por ID ou nome.
     */
    async findAgriculturaFamiliar(req, res, next) {
        try {
            const result = await AgriculturaFamiliarService.find(
                req.params.value,
                req.session.user,
                req.query.page,
                req.query.limit,
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "agricultura-familiar",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `caf/${result.result.CAF}`,
                        `dap/${result.result.DAP}`,
                        `programa/${convertString(result.result.PROGRAMA)}`,
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "agricultura-familiar",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `caf/${result.result[0].CAF}`,
                        `dap/${result.result[0].DAP}`,
                        `programa/${convertString(result.result[0].PROGRAMA)}`,
                    ]
                );
            };

            req.log.info({
                event: "AGRICULTURA_FIND",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Membro da agricultura familiar consultado por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_FIND_ERROR",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar membro da agricultura familiar consultado por id ou nome");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca registros de agricultura familiar pelo número do CAF.
     */
    async findCafAgriculturaFamiliar(req, res, next) {
        try {
            const result = await AgriculturaFamiliarService.findbyCaf(
                req.params.caf,
                req.session.user,
                req.query.page,
                req.query.limit,
            );
            const hateoas = Hateoas(
                result.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "agricultura-familiar",
                ["",
                    result.result.ID,
                    convertString(result.result.NOME),
                    `caf/${result.result.CAF}`,
                    `dap/${result.result.DAP}`,
                    `programa/${convertString(result.result.PROGRAMA)}`,
                ]
            );

            req.log.info({
                event: "AGRICULTURA_FIND",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.caf
            }, "Membro da agricultura familiar consultado por CAF");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_FIND_ERROR",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.caf
            }, "Erro ao buscar membro da agricultura familiar consultado por CAF");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca registros de agricultura familiar pelo número da DAP.
     */
    async findDapAgriculturaFamiliar(req, res, next) {
        try {
            const result = await AgriculturaFamiliarService.findbyDap(
                req.params.dap,
                req.session.user,
                req.query.page,
                req.query.limit,
            );
            const hateoas = Hateoas(
                result.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "agricultura-familiar",
                ["",
                    result.result.ID,
                    convertString(result.result.NOME),
                    `caf/${result.result.CAF}`,
                    `dap/${result.result.DAP}`,
                    `programa/${convertString(result.result.PROGRAMA)}`,
                ]
            );

            req.log.info({
                event: "AGRICULTURA_FIND",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Membro da agricultura familiar consultado por DAP");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_FIND_ERROR",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.dap
            }, "Erro ao buscar membro da agricultura familiar consultado por DAP");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca registros de agricultura familiar vinculados a um programa.
     */
    async findProgramaAgriculturaFamiliar(req, res, next) {
        try {
            const result = await AgriculturaFamiliarService.findbyPrograma(
                convertString(req.params.programa),
                req.session.user,
                req.query.page,
                req.query.limit,
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "agricultura-familiar",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `caf/${result.result[0].CAF}`,
                    `dap/${result.result[0].DAP}`,
                    `programa/${convertString(result.result[0].PROGRAMA)}`,
                ]
            );

            req.log.info({
                event: "AGRICULTURA_FIND",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.programa
            }, "Membro da agricultura familiar consultado por programa");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_FIND_ERROR",
                resource: "agricultura_familiar",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.programa
            }, "Erro ao buscar membro da agricultura familiar consultado por programa");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria um novo registro de agricultura familiar.
     */
    async createAgriculturaFamiliar(req, res, next) {
        try {
            await AgriculturaFamiliarService.createAgriculturaFamiliar(
                req.body,
                req.session.user
            );
            const find = await AgriculturaFamiliarService.findbyDap(
                req.body.DAP,
                req.session.user,
                1,
                1,
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "agricultura-familiar",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `caf/${find.result.CAF}`,
                    `dap/${find.result.DAP}`,
                    `programa/${convertString(find.result.PROGRAMA)}`,
                ]
            );

            req.log.info({
                event: "AGRICULTURA_CREATE",
                resource: "agricultura_familiar",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Membro da agricultura familiar criado");

            res.status(201).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_CREATE_ERROR",
                resource: "agricultura_familiar",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar membro da agricultura familiar");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Atualiza um registro existente de agricultura familiar.
     */
    async updateAgriculturaFamiliar(req, res, next) {
        try {
            await AgriculturaFamiliarService.updateAgriculturaFamiliar(
                req.params.id,
                req.body,
                req.session.user
            );
            const find = await AgriculturaFamiliarService.find(
                req.params.id,
                req.session.user,
                1,
                1,
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "agricultura-familiar",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `caf/${find.result.CAF}`,
                    `dap/${find.result.DAP}`,
                    `programa/${convertString(find.result.PROGRAMA)}`,
                ]
            );

            req.log.info({
                event: "AGRICULTURA_UPDATE",
                resource: "agricultura_familiar",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Membro da agricultura familiar atualizado");

            res.status(200).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_UPDATE_ERROR",
                resource: "agricultura_familiar",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar membro da agricultura familiar");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Remove um registro de agricultura familiar.
     */
    async deleteAgriculturaFamiliar(req, res, next) {
        try {
            const result = await AgriculturaFamiliarService.deleteAgriculturaFamiliar(
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
                event: "AGRICULTURA_DELETE",
                resource: "agricultura_familiar",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Membro da agricultura familiar excluído");

            res.status(200).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "AGRICULTURA_DELETE_ERROR",
                resource: "agricultura_familiar",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar membro da agricultura familiar");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new AgriculturaFamiliarController();