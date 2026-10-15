const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const Erros = require("../errors/Errors");
const secret = process.env.JWT_SECRET;

class authToken {
    async createToken(session, refreshToken) {
        try {
            if (!session) {
                throw new Erros("Sessão não encontrada", 404);
            };

            //compara hash
            if (!bcrypt.compare(session.REFRESH_TOKEN_HASH, refreshToken)) {
                throw new Erros('Inconsistência no refresh token', 400);
            };

            const token = jwt.sign({
                id: session.ID_PESSOA,
                sessionID: session.ID
            }, secret, { expiresIn: "15min" });

            return {
                token,
                refreshToken
            };

        } catch (error) {
            console.log(error);
            throw new Erros("Erro ao gerar token", 403);
        };
    };

    async createRefreshToken(session, ip) {
        try {
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

            const sessao = {
                ID_PESSOA: session.ID_PESSOA,
                ID_SECRETARIA: session.ID_SECRETARIA,
                ID_ASSOCIACAO: session.ID_ASSOCIACAO,
                REFRESH_TOKEN_HASH: refreshTokenHash,
                // DISPOSITIVO: headers['user-agent'],
                REVOGADO: null,
                IP: ip,
                CRIADO: new Date(),
                EXPIRA: new Date(
                    // Date.now() + 15 * 60 * 1000 
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                )
            };

            return {
                sessao,
                refreshToken,
            };

        } catch (error) {
            console.log(error);
            throw new Erros("Erro ao gerar token", 403);
        };
    };
};

module.exports = new authToken;