const Erros = require("../errors/Errors");

/**
 * Aplica filtro de escopo para limitar o acesso por nivel de privilegio
 * 
 * Subistitudo aprimorado do BaseService, melhorando a performace e a logica
 */
class baseScop {
    async permissions(session, page, limit, actions) {
        const permissions = {
            1: ["admin"],
            2: ["secretaria", session.secretaria],
            3: ["associacao", session.associacao],
            4: ["usuario", session.id]
        };

        let permission = permissions[session.nivel];

        if (permission === null || permission === undefined) {
            permission = [];
        };

        const level = permission[0];
        const value = permission[1];
        
        if (typeof (actions[level]) !== "function") {
            throw new Erros("Permissão inválida", 403);
        };
        
        if (value == undefined) {
            return actions[level](page, limit);
        } else {
            return actions[level](value, page, limit);
        };
    };

    async getAll(session, page, limit, actions) {
        return this.permissions(session, page, limit, actions);
    };

    async getFind(session, page, limit, actions) {
        return this.permissions(session, page, limit, actions);
    };

    async update(id, user, session, fieldSession, fieldUser, method) {
        if (session.nivel === 1) {
            return await method(id, user);
        };

        if (session.nivel === 2) {
            if (parseInt(user[fieldUser]) !== session[fieldSession]) {
                throw new Erros("Não autorizado", 403);
            };

            const { [fieldUser]: removedField, ...filterUser } = user;

            return await method(id, filterUser);
        } else {
            throw new Erros("Não autorizado", 403);
        };
    };

    async delete(id, user, session, fieldSession, fieldUser, method) {
        if (session.nivel === 1) {
            return await method(id);
        };

        if (session.nivel === 2) {
            if (parseInt(user[fieldUser]) !== session[fieldSession]) {
                throw new Erros("Não autorizado", 403);
            };

            return await method(id);
        } else {
            throw new Erros("Não autorizado", 403);
        };
    };
};

module.exports = new baseScop();