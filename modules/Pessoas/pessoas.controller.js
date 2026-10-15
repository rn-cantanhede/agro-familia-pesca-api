const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const PessoasService = require("./pessoas.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas as Pessoas e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class PessoasController {
    /**
     * Retorna a lista completa de pessoas.
     */

    async AllPessoas(req, res) {
        try {
            const pessoas = await PessoasService.findAllPessoas(
                req.session.user,
                req.query.page,
                req.query.limit
            );
            let hateoas;

            if (!Array.isArray(pessoas.result)) {
                hateoas = Hateoas(
                    pessoas.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "pessoas",
                    ["",
                        pessoas.result.ID,
                        convertString(pessoas.result.NOME),
                        `genero/${pessoas.result.GENERO}`,
                        `data/${pessoas.result.DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                        `data/intervalo/1980-03-15/1995-05-05`,
                    ]
                )
            } else {
                hateoas = Hateoas(
                    pessoas.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "pessoas",
                    ["",
                        pessoas.result[0].ID,
                        convertString(pessoas.result[0].NOME),
                        `genero/${pessoas.result[0].GENERO}`,
                        `data/${pessoas.result[0].DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                        `data/intervalo/1980-03-15/1995-05-05`,
                    ]
                );
            };

            req.log.info({
                event: "PESSOA_LIST",
                resource: "pessoa",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem de pessoas");

            return res.status(200).json({
                result: pessoas.result,
                total: pessoas.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_LIST_ERROR",
                resource: "pessoa",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar os pessoas");

            console.error(error);
            return res.status(500).json({ Error: "Erro interno no servidor" });
        };
    };

    /**
     * Busca uma pessoa pelo ID ou pelo nome.
     */

    async findPessoa(req, res, next) {
        try {
            const result = await PessoasService.find(
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
                    "pessoas",
                    ["",
                        result.result.ID,
                        convertString(result.result.NOME),
                        `genero/${result.result.GENERO}`,
                        `data/${result.result.DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                        `data/intervalo/1980-03-15/1995-05-05`,
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID,
                    process.env.URL,
                    req.session.user.nivel,
                    "pessoas",
                    ["",
                        result.result[0].ID,
                        convertString(result.result[0].NOME),
                        `genero/${result.result[0].GENERO}`,
                        `data/${result.result[0].DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                        `data/intervalo/1980-03-15/1995-05-05`,
                    ]
                );
            };

            req.log.info({
                event: "PESSOA_FIND",
                resource: "pessoa",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Pessoa consultado por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_FIND_ERROR",
                resource: "pessoa",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar pessoa");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Lista pessoas filtrando pelo gênero.
     */

    async findGeneroPessoa(req, res, next) {
        try {
            const result = await PessoasService.findbyGenero(
                req.params.genero,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "pessoas",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `genero/${result.result[0].GENERO}`,
                    `data/${result.result[0].DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                    `data/intervalo/1980-03-15/1995-05-05`,
                ]
            );

            req.log.info({
                event: "PESSOA_FIND",
                resource: "pessoa",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.genero
            }, "Pessoa consultado por genero");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_FIND_ERROR",
                resource: "pessoa",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.genero
            }, "Erro ao buscar pessoa por genero");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Lista pessoas filtrando pela data de nascimento.
     */

    async findDataPessoa(req, res, next) {
        try {
            const result = await PessoasService.findbyData(
                req.params.data,
                req.session.user,
                req.query.page,
                req.query.limit
            );
            const hateoas = Hateoas(
                result.result[0].ID,
                process.env.URL,
                req.session.user.nivel,
                "pessoas",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `genero/${result.result[0].GENERO}`,
                    `data/${result.result[0].DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                    `data/intervalo/1980-03-15/1995-05-05`,
                ]
            );

            req.log.info({
                event: "PESSOA_FIND",
                resource: "pessoa",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.data
            }, "Pessoa consultada por data de nascimento");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_FIND_ERROR",
                resource: "pessoa",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.data
            }, "Erro ao buscar pessoa por data de nascimento");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Lista pessoas dentro de um intervalo de datas de nascimento.
     */

    async findInicioFimPessoa(req, res, next) {
        try {
            const result = await PessoasService.findByInicioFim(
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
                "pessoas",
                ["",
                    result.result[0].ID,
                    convertString(result.result[0].NOME),
                    `genero/${result.result[0].GENERO}`,
                    `data/${result.result[0].DATA_NASCIMENTO.toISOString().split('T')[0]}`,
                    `data/intervalo/1980-03-15/1995-05-05`,
                ]
            );

            req.log.info({
                event: "PESSOA_FIND",
                resource: "pessoa",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Pessoa consultada por intervalo de datas");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_FIND_ERROR",
                resource: "pessoa",
                action: "find",
                usuarioId: req.session.user.id,
                target: {
                    inicio: req.params.inicio,
                    fim: req.params.fim
                }
            }, "Erro ao consultar pessoa por intervalo de datas");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Cria um novo registro de pessoa.
     */

    async createPessoa(req, res, next) {
        try {
            const result = await PessoasService.createPessoa(
                req.body,
                req.session.user
            );
            const hateoas = Hateoas(
                "",
                process.env.URL,
                req.session.user.nivel,
                "pessoas",
                ["",
                    convertString(req.body.NOME),
                    `genero/${req.body.GENERO}`,
                    `data/${req.body.DATA_NASCIMENTO}`,
                    `data/intervalo/1980-03-15/1995-05-05`,
                ]
            );

            req.log.info({
                event: "PESSOA_CREATE",
                resource: "pessoa",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Pessoa criado");

            return res.status(201).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET,
                    POST: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_CREATE_ERROR",
                resource: "pessoa",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Erro ao criar pessoa");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Atualiza os dados de uma pessoa existente.
     */

    async updatePessoa(req, res, next) {
        try {
            const result = await PessoasService.updatePessoa(
                req.params.id,
                req.body,
                req.session.user
            );
            const hateoas = Hateoas(
                req.params.id,
                process.env.URL,
                req.session.user.nivel,
                "pessoas",
                ["",
                    req.params.id,
                    convertString(req.body.NOME),
                    `genero/${req.body.GENERO}`,
                    `data/${req.body.DATA_NASCIMENTO}`,
                    `data/intervalo/1980-03-15/1995-05-05`,
                ]
            );

            req.log.info({
                event: "PESSOA_UPDATE",
                resource: "pessoa",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Pessoa atualizada");

            return res.status(200).json({
                result: result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_UPDATE_ERROR",
                resource: "pessoa",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar pessoa");

            console.error(error);
            return next(error);
        };
    };

    /**
     * Remove uma pessoa pelo ID.
     */

    async deletePessoa(req, res, next) {
        try {
            const result = await PessoasService.deletePessoa(
                req.params.id,
                req.session.user
            );
            const hateoas = Hateoas(
                req.params.id,
                process.env.URL,
                req.session.user.nivel,
                "pessoas",
                ""
            );

            req.log.info({
                event: "PESSOA_DELETE",
                resource: "pessoa",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Pessoa excluída");

            return res.status(200).json({
                result: result,
                hateoas: {
                    Post: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "PESSOA_DELETE_ERROR",
                resource: "pessoa",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar pessoa");

            console.error(error);
            return next(error);
        };
    };
};

module.exports = new PessoasController();