const Erros = require("../shared/errors/Errors");

/**
 * Middleware global de tratamento de erros.
 * Centraliza o retorno de respostas de erro da aplicação,
 * diferenciando erros controlados (customizados) de erros inesperados.
 */

function errorHandle(err, req, res, next) {

    /**
     * Verifica se o erro lançado é uma instância da classe de erros customizados.
     * Esses erros normalmente representam falhas de validação,
     * regras de negócio ou recursos não encontrados.
     */

    if (err instanceof Erros) {
        return res.status(err.statusCode).json({ error: err.message });
    };

    console.error(err);

    return res.status(500).json({ error: "Erro interno no servidor" });
};

module.exports = errorHandle;
