const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const LocalizacaoBeneficiadoService = require("./localizacao-beneficiado.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas às localizações beneficiadas.
 *
 * Atua como ponte entre as rotas e a camada de service,
 * lidando apenas com request, response e status HTTP.
 */

class LocalizacaoBeneficiadoController {

    /**
     * Retorna todas as localizações beneficiadas.
     */

    async AllLocalizacoes(req, res) {
        try {
            const localizacoes = await LocalizacaoBeneficiadoService.findAllLocalizacao(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(localizacoes.result)) {
                hateoas = Hateoas(
                    localizacoes.result.ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "localizacao-beneficiado",
                    ["",
                        localizacoes.result.ID,
                        convertString(localizacoes.result.NOME),
                        `associacao/${convertString(localizacoes.result.ASSOCIACAO)}`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    localizacoes.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "localizacao-beneficiado",
                    ["",
                        localizacoes.result[0].ID,
                        convertString(localizacoes.result[0].NOME),
                        `associacao/${convertString(localizacoes.result[0].ASSOCIACAO)}`,
                    ]
                );
            };

            req.log.info({
                event: "LOCALIZACAO_LIST",
                resource: "localizacao_beneficiada",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem das localizações");

            return res.status(200).json({
                result: localizacoes.result,
                total: localizacoes.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_LIST_ERROR",
                resource: "localizacao_beneficiada",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar as localizações");

            console.log(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca uma localização beneficiada por ID ou Nome.
     */

    async findLocalizacao(req, res, next) {
        try {
            const result = await LocalizacaoBeneficiadoService.find(
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
                    "localizacao-beneficiado",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `associacao/${convertString(result.result.ASSOCIACAO)}`,
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "localizacao-beneficiado",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                    ]
                );
            };

            req.log.info({
                event: "LOCALIZACAO_FIND",
                resource: "localizacao_beneficiada",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Localização consultada por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_FIND_ERROR",
                resource: "localizacao_beneficiada",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar localização por id ou nome");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Lista localizações beneficiadas filtrando
     * pelo nome da associação.
     */

    async findAssociacao(req, res, next) {
        try {
            const result = await LocalizacaoBeneficiadoService.findbyAssociacao(
                req.params.associacao,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "localizacao-beneficiado",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `associacao/${convertString(result.result[0].ASSOCIACAO)}`,
                ]
            );

            req.log.info({
                event: "LOCALIZACAO_FIND",
                resource: "localizacao_beneficiada",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.associacao
            }, "Localização consultada por associação");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_FIND_ERROR",
                resource: "localizacao_beneficiada",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.associacao
            }, "Erro ao buscar localização por associação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria uma nova localização beneficiada.
     */

    async createlocalizacao(req, res, next) {
        try {
            await LocalizacaoBeneficiadoService.createlocalizacao(
                req.body,
                req.session.user
            );
            const find = await LocalizacaoBeneficiadoService.find(
                req.body.ID_ASSOCIADO,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "localizacao-beneficiado",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `associacao/${convertString(find.result.ASSOCIACAO)}`,
                ]
            );

            req.log.info({
                event: "LOCALIZACAO_CREATE",
                resource: "localizacao_beneficiada",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Localização criada");

            res.status(201).json({
                result: find.result,
                hateoas: {
                    GET: hateoas.GET,
                    PUT: hateoas.PUT,
                    DELETE: hateoas.DELETE,
                }
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_CREATE_ERROR",
                resource: "localizacao_beneficiada",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar localização");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Atualiza uma localização beneficiada existente.
     */

    async updateLocalizacao(req, res, next) {
        try {
            await LocalizacaoBeneficiadoService.updateLocalizacao(
                req.params.id,
                req.body,
                req.session.user
            );
            const find = await LocalizacaoBeneficiadoService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID,
                process.env.URL,
                req.session.user.nivel,
                "localizacao-beneficiado",
                ["",
                    find.result.ID,
                    convertString(find.result.NOME),
                    `associacao/${convertString(find.result.ASSOCIACAO)}`,
                ]
            );

            req.log.info({
                event: "LOCALIZACAO_UPDATE",
                resource: "localizacao_beneficiada",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Localização atualizada");

            res.status(200).json({
                result: find.result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST,
                    DELETE: hateoas.DELETE,
                }
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_UPDATE_ERROR",
                resource: "localizacao_beneficiada",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar localização");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Remove uma localização beneficiada.
     */

    async deleteLocalizacao(req, res, next) {
        try {
            const result = await LocalizacaoBeneficiadoService.deleteLocalizacao(
                req.params.id,
                req.session.user
            );
            const hateoas = Hateoas(
                "",
                process.env.URL,
                req.session.user.nivel,
                "localizacao-beneficiado",
                ""
            );

            req.log.info({
                event: "LOCALIZACAO_DELETE",
                resource: "localizacao_beneficiada",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Localização excluída");

            res.status(200).json({
                // result: result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST,
                }
            });
        } catch (error) {
            req.log.error({
                event: "LOCALIZACAO_DELETE_ERROR",
                resource: "localizacao_beneficiada",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Localização excluída");

            console.log(error);
            return next(error);
        };
    };
};

module.exports = new LocalizacaoBeneficiadoController();