const Erros = require("../errors/Errors");

/**
 * Converte a string passada por url em um padrão acesivel 
 * para consulta no database ou para o hateoas.
 */

function convertString(value) {
    let text;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    };

    if (typeof value == "number") {
        return value;
    };

    if (value.includes(" ")) {
        return value.replaceAll(" ", "-");
    } else {
        text = value;
    };

    if (value.includes("-")) {
        return value.replaceAll("-", " ");
    } else {
        text = value;
    };

    return text;
};

/**
 * Executa uma operação de busca usando o método fornecido.
 * Lança erro 404 quando o resultado não é encontrado.
 */

async function find(value, page, limit, method) {
    const result = await method(convertString(value), page, limit);

    if (!result) {
        throw new Erros("Não encontrado", 404);
    };

    return result;
};

/**
 * Realiza busca dinâmica com base no tipo do valor recebido.
 * Valores numéricos utilizam o método de busca por ID.
 * Demais valores utilizam o método de busca por nome.
 */

async function findByIdName(value, page, limit, idMethod, nameMethod) {
    if (isNaN(value)) {
        return find(convertString(value), page, limit, nameMethod);
    };

    return find(value, page, limit, idMethod);
};

/**
 * Realiza busca dinâmica com base no tipo do valor recebido.
 * Valores numéricos utilizam o método de busca por ID.
 * Demais valores utilizam o método de busca por nome.
 * Usado para aplicar escopo.
 */

async function findByScope(sessionID, sessionField, fieldID, fieldName,
    value, page, limit, method
) {
    if (!isNaN(value)) {
        const result = await method(sessionID, sessionField, fieldID, value, page, limit);

        if (result == "" || result == undefined) {
            throw new Erros("Não encontrado", 404);
            
        };
        return result;
    };
    
    const result = await method(sessionID, sessionField, fieldName, convertString(value), page, limit);
    if (result == "" || result == undefined) {
        throw new Erros("Não encontrado", 404);
    };
    return result;
};

/**
 * Executa busca por intervalo utilizando o método especificado.
 * Lança erro 404 caso nenhum registro seja retornado.
 */

async function findByInterval(inicio, fim, page, limit, method) {
    const result = await method(convertString(inicio), convertString(fim), page, limit);

    if (!result) {
        throw new Erros("Não encontrado", 404);
    };

    return result;
};


/**
 * Executa busca por intervalo utilizando o método especificado aplicando escopo.
 * Lança erro 404 caso nenhum registro seja retornado.
 */
async function findByIntervalScope(sessionID, sessionField, field, inicio, fim, page, limit, method) {
    const result = await method(sessionID, sessionField, field, convertString(inicio), convertString(fim), page, limit);

    if (!result) {
        throw new Erros("Não encontrado", 404);
    };

    return result;
};

/**
 * Recebe um objeto do service e executa verificação de nivel.
 * retorna em string o nivel para o heteoas. 
 */
function VerifyNivel(user) {
    if (!user) {
        throw new Erros("Usuário não autenticado", 401);
    };

    switch (user) {
        case 1:
            return "admin";

        case 2:
            return "secretaria";

        case 3:
            return "associacao";

        case 4:
            return "usuario";

        default:
            throw new Erros("Nível de usuário inválido", 403);
    };
};

module.exports = {
    find,
    findByIdName,
    findByScope,
    findByInterval,
    findByIntervalScope,
    VerifyNivel,
    convertString
};