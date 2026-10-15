const Erros = require("../errors/Errors");

/**
 * Converte a string passada por url em um padrão acesivel 
 * para consulta no database ou para o hateoas.
 */

function convertString(value) {
    if (value.includes(" ")) {
        const string = value.split(" ");
        const convertedString = string.join("-");
        return convertedString;
    };
    
    const string = value.split("-");
    const convertedString = string.join(" ");
    return convertedString;
};

/**
 * Faz a verificação de tipo
 */

function NumberOrString(value) {
    if (isNaN(value)) {
        return true;
    } else {
        return false;
    };
};

/**
 * Executa uma operação de busca usando o método fornecido.
 * Lança erro 404 quando o resultado não é encontrado.
 */

async function find(value, page, limit, method) {
    const result = await method(value, page, limit);

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
    if (NumberOrString(value)) {
        const stringConverted = convertString(value);
        return find(stringConverted, page, limit, nameMethod);
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
    if (!NumberOrString(value)) {
        const result = await method(sessionID, sessionField, fieldID, value, page, limit);

        if (result == "" || result == undefined) {
            throw new Erros("Não encontrado", 404);

        };
        return result;
    };

    const stringConverted = convertString(value);
    const result = await method(sessionID, sessionField, fieldName, stringConverted, page, limit);
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
    const result = await method(inicio, fim, page, limit);

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
    const result = await method(sessionID, sessionField, field, inicio, fim, page, limit);

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

/**
 * Faz a verificação para listar usuarios onde o a secretaria
 * ou a associção seja igual a requirida.
 * 
 * Abandonado
 * 
 */
function listUsers(usuarioObj, field, value) {
    if (Array.isArray(usuarioObj)) {
        const usuariosList = usuarioObj.filter(
            (element) => element[field] == value
        );

        if (usuariosList.length === 0) {
            throw new Erros("Não encontrado", 404);
        }

        return usuariosList;
    };

    if (!Array.isArray(usuarioObj)) {
        if (usuarioObj[field] == value) {
            return usuarioObj
        } else {
            throw new Erros("Não encontrado", 404);
        };
    };
};

module.exports = {
    find,
    findByIdName,
    findByScope,
    findByInterval,
    findByIntervalScope,
    VerifyNivel,
    listUsers,
    convertString
};