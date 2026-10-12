const jwt = require("jsonwebtoken");
const Erros = require("../shared/errors/Errors");
const { findBy, updateData } = require("../shared/Utils/dbUtils");
const authToken = require("../shared/Utils/authToken");
const secureLogger = require("../config/secureLogger");

/**
 * Exporta um middleware de autenticação.
 * Este middleware será utilizado para proteger rotas
 * que exigem que o usuário esteja autenticado.
 */
module.exports = async function auth(req, res, next) {
    const token = req.session.token;
    const refreshToken = req.session.refreshToken;
    const secret = process.env.JWT_SECRET;

    if (!token) {
        req.log.warn({
            event: "AUTH_TOKEN_WARN",
            resource: "authentication",
            action: "login"
        }, "Token não informado");

        secureLogger.warn({
            event: "AUTH_TOKEN_WARN",
            resource: "authentication",
            action: "login"
        }, "Token não informado");

        return next(new Erros("Token não informado", 401));
    };

    // const bearer = authToken.split(" ");
    // const token = bearer[1];

    try {
        const decoded = jwt.verify(token, secret);
        const sessao = await findBy("ID_PESSOA", decoded.id, false, "sessoes", 1, 1);

        if (!sessao) {
            await updateData(req.session.user.id, { REVOGADO: new Date() }, "sessoes");

            req.log.error({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão não encontrada");

            secureLogger.error({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão não encontrada");

            return next(new Erros("Sessão não encontrada", 404));
        };

        if (sessao.result.EXPIRA < new Date()) {
            req.log.error({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão expirada");

            secureLogger.warn({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão expirada");

            return next(new Erros("Sessão expirada", 400));
        };

        if (sessao.result.REVOGADO != null) {
            req.log.error({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão revogada");

            secureLogger.warn({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Sessão revogada");

            return next(new Erros("Sessão revogada", 400));
        };

        const user = await findBy("ID_PESSOA", sessao.result.ID_PESSOA, false, "usuario", 1, 1);

        if (!user) {
            return next(new Erros("Usuário não encontrado", 404));
        };

        if (user.result.NIVEL != req.session.user.nivel ||
            user.result.ID_PESSOA != req.session.user.id ||
            user.result.LOGIN != req.session.user.login ||
            user.result.ID_SECRETARIA != req.session.user.secretaria ||
            user.result.ID_ASSOCIACAO != req.session.user.associacao
        ) {
            //Revoga sessão caso tenha inconsistencia
            await updateData(req.session.user.id, { REVOGADO: new Date() }, "sessoes");

            req.log.warn({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Inconsistência na geração do token");

            secureLogger.warn({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }, "Inconsistência na geração do token");

            return next(new Erros(
                "Inconsistência na geração do token. Realize login novamente",
                400
            ));
        };

        //Atualiza ultimo uso
        await updateData(req.session.user.id, { USADO: new Date() }, "sessoes");

        req.log.info({
            event: "AUTH_TOKEN",
            resource: "authentication",
            action: "auth",
            usuarioId: req.session.user.id,
        }, "Token válido");

        secureLogger.info({
            event: "AUTH_TOKEN",
            resource: "authentication",
            action: "auth",
            usuarioId: req.session.user.id,
        }, "Token válido");

        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            req.log.info({
                event: "AUTH_TOKEN",
                resource: "authentication",
                action: "auth",
                usuarioId: req.session.user.id,
            }, "Token expirou");

            secureLogger.info({
                event: "AUTH_TOKEN",
                resource: "authentication",
                action: "auth",
                usuarioId: req.session.user.id,
            }, "Token expirou");

            const decoded = jwt.decode(token);

            if (!decoded.id) {
                req.log.error({
                    event: "AUTH_TOKEN",
                    resource: "authentication",
                    action: "auth",
                    usuarioId: req.session.user.id,
                }, "Token inválido");
                
                secureLogger.error({
                    event: "AUTH_TOKEN",
                    resource: "authentication",
                    action: "auth",
                    usuarioId: req.session.user.id,
                }, "Token inválido");

                return next(new Erros("Token inválido", 401));
            };

            const sessao = await findBy(
                "ID_PESSOA",
                decoded.id,
                false,
                "sessoes",
                1,
                1
            );

            if (!sessao) {
                req.log.error({
                    event: "AUTH_TOKEN",
                    resource: "authentication",
                    action: "auth",
                    usuarioId: req.session.user.id,
                }, "Sessão não encontrada");

                secureLogger.error({
                    event: "AUTH_TOKEN",
                    resource: "authentication",
                    action: "auth",
                    usuarioId: req.session.user.id,
                }, "Sessão não encontrada");

                return next(new Erros("Sessão não encontrada", 404));
            };

            const newToken = await authToken.createToken(
                sessao.result,
                refreshToken
            );

            req.session.token = newToken.token;

            req.log.info({
                event: "AUTH_TOKEN",
                resource: "authentication",
                action: "auth",
                usuarioId: req.session.user.id,
            }, "Token gerado");

            secureLogger.info({
                event: "AUTH_TOKEN",
                resource: "authentication",
                action: "auth",
                usuarioId: req.session.user.id,
            }, "Token gerado");

            return next();
        };

        console.log(error);

        return next(new Erros("Token inválido", 401));
    };
};