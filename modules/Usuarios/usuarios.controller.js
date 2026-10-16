const secureLogger = require("../../config/secureLogger");
const { convertString } = require("../../shared/Utils/findUtils");
const Hateoas = require("../../shared/Utils/hateoas");
const UsuariosService = require("./usuarios.service");

/**
 * Controller responsável por receber as requisições HTTP
 * relacionadas aos Usuarios e repassar para a camada de Service.
 * Aqui não há regra de negócio, apenas controle de fluxo e resposta HTTP.
 */
class UsuariosController {

    /**
     * Retorna todos os usuarios.
     */
    async findAllUsuarios(req, res, next) {
        try {
            const view = await UsuariosService.findAllUsuarios(
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            let hateoas;

            if (!Array.isArray(view.result)) {
                hateoas = Hateoas(
                    view.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", view.result.ID, convertString(view.result.NOME),
                        `nivel/${view.result.NIVEL}`,
                        `secretaria/${convertString(view.result.SECRETARIA)}`,
                        `login/${view.result.LOGIN}`
                    ]
                );
            } else {
                hateoas = Hateoas(
                    view.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", view.result[0].ID, convertString(view.result[0].NOME),
                        `nivel/${view.result[0].NIVEL}`,
                        `secretaria/${convertString(view.result[0].SECRETARIA)}`,
                        `login/${view.result[0].LOGIN}`
                    ]
                );
            };

            req.log.info({
                event: "USER_LIST",
                resource: "usuario",
                action: "list",
                usuarioID: req.session.user.id
            }, "Listagem de usuários");

            return res.status(200).json({
                result: view.result,
                total: view.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "USER_LIST_ERROR",
                resource: "usuario",
                action: "list",
                usuarioID: req.session.user.id
            }, "Erro ao listar usuários");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca usuario por ID ou Nome.
     */
    async findUsuarios(req, res, next) {
        try {
            const result = await UsuariosService.find(
                req.params.value,
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", result.result.ID, convertString(result.result.NOME),
                        `nivel/${result.result.NIVEL}`,
                        `secretaria/${convertString(result.result.SECRETARIA)}`,
                        `login/${result.result.LOGIN}`
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", result.result[0].ID, convertString(result.result[0].NOME),
                        `nivel/${result.result[0].NIVEL}`,
                        `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                        `login/${result.result[0].LOGIN}`
                    ]
                );
            };

            req.log.info({
                event: "USER_FIND",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.value
            }, "Usuário consultado por id ou nome");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "USER_FIND_ERROR",
                resource: "usuario",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.value
            }, "Erro ao buscar usuário");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca usuario pelo Nivel.
     */
    async findNivelUsuarios(req, res, next) {
        try {
            const result = await UsuariosService.findByNivel(
                req.params.nivel,
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );

            const hateoas = Hateoas(
                result.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                [
                    "", result.result.ID, convertString(result.result.NOME),
                    `nivel/${result.result.NIVEL}`,
                    `secretaria/${convertString(result.result.SECRETARIA)}`,
                    `login/${result.result.LOGIN}`
                ]
            );

            req.log.info({
                event: "USER_FIND",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.nivel
            }, "Usuário consultado por nivel");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "USER_FIND_ERROR",
                resource: "usuario",
                action: "find",
                usuarioID: req.session.user.id,
                target: req.params.nivel
            }, "Erro ao buscar usuário por nivel");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca usuario pela Secretaria.
     */
    async findSecretariaUsuarios(req, res, next) {
        try {
            const result = await UsuariosService.findBySecretaria(
                req.params.secretaria,
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            let hateoas;

            if (!Array.isArray(result.result)) {
                hateoas = Hateoas(
                    result.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", result.result.ID, convertString(result.result.NOME),
                        `nivel/${result.result.NIVEL}`,
                        `secretaria/${convertString(result.result.SECRETARIA)}`,
                        `login/${result.result.LOGIN}`
                    ]
                );
            } else {
                hateoas = Hateoas(
                    result.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                    [
                        "", result.result[0].ID, convertString(result.result[0].NOME),
                        `nivel/${result.result[0].NIVEL}`,
                        `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                        `login/${result.result[0].LOGIN}`
                    ]
                );
            };

            req.log.info({
                event: "USER_FIND",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.secretaria
            }, "Consulta por usuarios de uma secretaria");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "USER_FIND_ERROR",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.secretaria
            }, "Erro ao consultar usuários por secretaria");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Busca usuario pelo login.
     */
    async findByLogin(req, res, next) {
        try {
            const result = await UsuariosService.findByLogin(
                req.params.login,
                req.session.user,
                req.query.page || 1,
                req.query.limit || 10
            );
            const hateoas = Hateoas(
                result.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                [
                    "", result.result[0].ID, convertString(result.result[0].NOME),
                    `nivel/${result.result[0].NIVEL}`,
                    `secretaria/${convertString(result.result[0].SECRETARIA)}`,
                    `login/${result.result[0].LOGIN}`
                ]
            );

            req.log.info({
                event: "USER_FIND",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.login
            }, "Usuário consultado por login");

            return res.status(200).json({
                result: result.result,
                total: result.total,
                hateoas: hateoas
            });

        } catch (error) {
            req.log.error({
                event: "USER_FIND_ERROR",
                resource: "usuario",
                action: "find",
                usuarioId: req.session.user.id,
                target: req.params.login
            }, "Erro ao consultar usuário por login");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Cria um novo usuario.
     */
    async createUsuario(req, res, next) {
        try {
            await UsuariosService.createUsuario(req.body);
            const find = await UsuariosService.findByLogin(
                req.body.LOGIN,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result[0].ID, process.env.URL, req.session.user.nivel, "usuarios",
                [
                    "", find.result[0].ID,
                    `nivel/${find.result[0].NIVEL}`,
                    `secretaria/${find.result[0].ID_SECRETARIA}`,
                    `login/${find.result[0].LOGIN}`
                ]
            );

            req.log.info({
                event: "USER_CREATE",
                resource: "usuario",
                action: "create",
                usuarioId: req.session.user.id,
            }, "Usuário criado");

            return res.status(200).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "USER_CREATE_ERROR",
                resource: "usuario",
                action: "create",
                usuarioId: req.session.user.id
            }, "Erro ao criar usuario");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Modifica um usuario.
     */
    async updateUsuario(req, res, next) {
        try {
            await UsuariosService.updateUsuario(
                req.params.id, req.body, {
                nivel: req.session.user.nivel,
                secretaria: req.session.user.secretaria
            });
            const find = await UsuariosService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                [
                    "", find.result.ID,
                    `nivel/${find.result.NIVEL}`,
                    `secretaria/${find.result.ID_SECRETARIA}`,
                    `login/${find.result.LOGIN}`
                ]
            );

            req.log.info({
                event: "USER_UPDATE",
                resource: "usuario",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Usuário atualizado");

            return res.status(200).json({
                result: find.result,
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "USER_UPDATE_ERROR",
                resource: "usuario",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar usuario");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Modifica dados de login
     */
    async updateLogin(req, res, next) {
        try {
            await UsuariosService.updateLogin(
                req.params.id, req.body, {
                nivel: req.session.user.nivel,
                secretaria: req.session.user.secretaria
            });
            const find = await UsuariosService.find(
                req.params.id,
                req.session.user,
                1,
                1
            );
            const hateoas = Hateoas(
                find.result.ID, process.env.URL, req.session.user.nivel, "usuarios",
                [
                    "", find.result.ID,
                    `nivel/${find.result.NIVEL}`,
                    `secretaria/${find.result.ID_SECRETARIA}`,
                    `login/${find.result.LOGIN}`
                ]
            );

            req.log.info({
                event: "LOGIN_UPDATE",
                resource: "usuario",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Login atualizado");

            return res.status(200).json({
                messege: "Login atualizado",
                hateoas: hateoas
            });
        } catch (error) {
            req.log.error({
                event: "LOGIN_UPDATE_ERROR",
                resource: "usuario",
                action: "update",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao atualizar login");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Deleta um usuario.
     */
    async deleteUsuario(req, res, next) {
        try {
            const result = await UsuariosService.deleteUsuario(req.params.id,
                {
                    nivel: req.session.user.nivel,
                    secretaria: req.session.user.secretaria
                }
            );
            const hateoas = Hateoas("id", process.env.URL, req.session.user.nivel, "usuarios",
                ["", "id", "nome", "nivel/nivel", "secretaria/secretaria", "login/login"]
            );

            req.log.info({
                event: "USER_DELETE",
                resource: "usuario",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Usuário excluído");

            return res.status(200).json({
                result: result,
                hateoas: {
                    GET: hateoas.GET[0],
                    POST: hateoas.POST
                }
            });
        } catch (error) {
            req.log.error({
                event: "USER_DELETE_ERROR",
                resource: "usuario",
                action: "delete",
                usuarioId: req.session.user.id,
                targetId: req.params.id
            }, "Erro ao apagar usuario");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Realiza o processo de login do usuário.
     * Caso seja válido, os dados são armazenados na sessão.
     */

    async login(req, res, next) {
        try {
            const user = await UsuariosService.login(
                req.body,
                req.session.refreshToken,
                req.headers,
                req.ip
            );
            const find = await UsuariosService.find(
                user.reqUser.id,
                user.reqUser,
                1,
                10
            );

            let hateoas = Hateoas(
                find.result.ID, process.env.URL, find.result.NIVEL, "usuarios",
                [
                    "", find.result.ID,
                    `nivel/${find.result.NIVEL}`,
                    `secretaria/${convertString(find.result.SECRETARIA)}`,
                    `login/${find.result.LOGIN}`,
                ]
            );

            hateoas.GET.push(`${process.env.URL + "logout/"}`);

            if (!user) {
                req.log.warn({
                    event: "AUTH_LOGIN_FAILED",
                    resource: "usuario",
                    action: "login",
                    reason: "INVALID_CREDENTIALS"
                }, "Falha na autenticação");

                secureLogger.warn({
                    event: "AUTH_LOGIN_FAILED",
                    resource: "usuario",
                    action: "login",
                    reason: "INVALID_CREDENTIALS"
                }, "Falha na autenticação");

                return res.status(401).json({ Error: "Login invalido" });
            };

            req.session.user = user.reqUser;
            req.session.token = user.token.token;
            req.session.refreshToken = user.token.refreshToken;
            req.session.loggedAt = new Date();

            req.log.info({
                event: "AUTH_LOGIN",
                resource: "usuario",
                action: "login",
            }, "Login realizado");
            
            secureLogger.info({
                event: "AUTH_LOGIN",
                resource: "usuario",
                action: "login",
            }, "Login realizado");

            return res.status(200).json({
                Message: "Login realizado",
                hateoas: {
                    GET: hateoas.GET
                }
            });
        } catch (error) {
            req.log.warn({
                event: "AUTH_LOGIN_ERROR",
                resource: "usuario",
                action: "login",
                reason: "INVALID_CREDENTIALS"
            }, "Falha na autenticação");

            secureLogger.warn({
                event: "AUTH_LOGIN_ERROR",
                resource: "usuario",
                action: "login",
                reason: "INVALID_CREDENTIALS"
            }, "Falha na autenticação");

            console.log(error);
            return next(error);
        };
    };

    /**
     * Finaliza a sessão do usuário autenticado.
     * Remove os dados da sessão e limpa o cookie.
     */

    async logout(req, res, next) {
        try {
            const id = req.session.user.id;
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                };

                const cookieName = process.env.NODE_ENV === "production"
                    ? "__Host-auth"
                    : "auth"
                    ;

                res.clearCookie(cookieName);

                req.log.info({
                    event: "AUTH_LOGOUT",
                    resource: "usuario",
                    action: "logout",
                    usuarioId: id
                }, "Logout realizado");

                return res.status(200).json({
                    Message: "Logout realizado",
                    hateoas: {
                        POST: `${process.env.URL + "login/"}`
                    }
                });
            });
        } catch (error) {
            return next(error);
        };
    };
};

module.exports = new UsuariosController();