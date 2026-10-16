const knex = require("../../database/connection");

/**
 * Retorna todos os registros da tabela informada.
 * Operação genérica para consultas completas com paginação.
 */

async function findAll(table, page, limit) {
    const offset = (page - 1) * limit;
    const result = await knex.select("")
        .from(table)
        .limit(limit)
        .offset(offset);
    const count = await knex(table).count("* as count");
    const total = count;

    if (!result.length) {
        return undefined;
    };
    
    return { result, total };
};

/**
 * Retorna registros cujo ano do campo especificado
 * esteja dentro do intervalo informado com paginação.
 */

async function findByInterval(field, inicio, fim, table, page, limit) {
    const offset = (page - 1) * limit;
    const result = await knex.select("")
        .from(table)
        .whereRaw(`YEAR(??) BETWEEN ? AND ?`, [field, inicio, fim])
        .limit(limit)
        .offset(offset);

    const count = await knex(table).count("* as count");
    const total = count;

    if (!result.length) {
        return undefined;
    };

    return { result, total };
};

/**
 * Retorna registros cujo ano do campo especificado
 * esteja dentro do intervalo informado com escopo e paginação.
 */
async function findByIntervalWithScope(
    sessionID, 
    sessionField, 
    field, 
    inicio, 
    fim, 
    multiple = false, 
    table, 
    page, 
    limit
) {
    const offset = (page - 1) * limit;
    const result = await knex.select("")
        .from(table)
        .whereRaw(`YEAR(??) BETWEEN ? AND ?`, [field, inicio, fim])
        .andWhere(sessionField, sessionID)
        // .andWhere(sessionID, sessionField)
        .limit(limit)
        .offset(offset);

    const count = await knex(table).where(sessionField, sessionID).count("* as count");
    const total = count;

    if (!result.length) {
        return undefined;
    };

    return multiple ? { result, total } : { result: result[0], total };
};

/**
 * Executa busca por correspondência parcial em um campo com paginação.
 * Caso `multiple` seja falso, retorna apenas o primeiro resultado.
 */

async function findBy(field, value, multiple = false, table, page, limit) {
    const offset = (page - 1) * limit;
    let query = knex.select("").from(table);
    let countQuery = knex(table);

    if (isNaN(value)) {
        query = query.where(field, "like", `%${value}%`);
    } else {
        query = query.where(field, value);
    };

    const result = await query
        .from(table)
        .orderBy(field, "asc")
        .limit(limit)
        .offset(offset);

    if (isNaN(value)) {
        countQuery = countQuery.where(field, "like", `%${value}%`);
    } else {
        countQuery = countQuery.where(field, value);
    };

    const total = await countQuery.count("* as count");

    if (!result.length) {
        return undefined;
    };

    return multiple ? { result, total } : { result: result[0], total };
};

/**
 * Executa busca por correspondência aplicando escopo com paginação.
 * Caso `multiple` seja falso, retorna apenas o primeiro resultado.
*/

async function findWithScope(
    sessionID,
    sessionField,
    field,
    value,
    multiple = false,
    table,
    page,
    limit
) {
    const offset = (page - 1) * limit;
    let query = knex.select("").from(table);
    let countQuery = knex(table);

    if (isNaN(value)) {
        query = query.where(field, "like", `%${value}%`);
    } else {
        query = query.where(field, value);
    };

    const result = await query
        .andWhere(sessionField, sessionID)
        .orderBy(field, "asc")
        .limit(limit)
        .offset(offset);

    if (isNaN(value)) {
        countQuery = countQuery.where(field, "like", `%${value}%`);
    } else {
        countQuery = countQuery.where(field, value);
    };

    const total = await countQuery
        .andWhere(sessionField, sessionID)
        .count("* as count");

    if (!result.length) {
        return undefined;
    };

    return multiple ? { result, total } : { result: result[0], total };
};

/**
 * Insere dados na tabela informada.
 * Retorna o payload recebido após a operação.
 */

async function insertData(value, table) {
    const result = await knex(table).insert(value);
    return value;
};

/**
 * Modifica dados na tabela informada.
 * Retorna o payload recebido após a operação.
 */

async function updateData(id, value, table) {
    const result = await knex(table).where({ ID: id }).update(value);
    return value;
};

/**
 * Deleta dados na tabela informada.
 * Retorna o id e a tabela após a operação.
 */

async function deleteData(id, table) {
    await knex(table).where({ ID: id }).delete();
    return `Registro de ID: ${id} da tabela ${table} foi deletado`;
};

/**
 * Realiza a busca de credenciais de login no banco de dados.
 * Utilizado no processo de autenticação.
 */

async function loginDB(login) {
    const result = await knex("usuario")
        .select("ID", "LOGIN", "SENHA", "NIVEL", "ID_PESSOA", "ID_SECRETARIA", "ID_ASSOCIACAO")
        .where({ LOGIN: login.LOGIN })
        .first();

    if (!result) {
        return null;
    };

    return result;
};

module.exports = {
    findAll,
    findBy,
    findByInterval,
    findByIntervalWithScope,
    findWithScope,
    insertData,
    updateData,
    deleteData,
    loginDB
};