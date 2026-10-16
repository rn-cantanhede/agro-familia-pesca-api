const Erros = require("../shared/errors/Errors");

module.exports = function pagination(req, res, next) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1) {
        throw new Erros("O parâmetro 'page' deve ser um inteiro maior ou igual a 1", 400);
    };

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new Erros("O parâmetro 'limit' deve ser um inteiro entre 1 e 100", 400);
    };

    req.pagination = {
        page,
        limit,
        offset: (page - 1) * limit
    };

    next();
};