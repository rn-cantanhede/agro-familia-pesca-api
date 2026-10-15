const Erros = require("../../shared/errors/Errors");
const SecretariasPolicy = require("./policies/secretarias.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const SecretariasRepository = require("./secretarias.repository");
const { findByIdName, find, convertString } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade secretaria.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */
class SecretariasService {

    /**
     * Retorna todas as secretarias cadastradas, filtradas pelo escopo do usuário.
     */
    async findAllProgramas(session, page, limit) {
        if (!SecretariasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: SecretariasRepository.findAllSecretarias,
        });
    };

    /**
     * Busca secretaria por ID ou Nome, respeitando a visibilidade do usuário.
     */
    async find(value, session, page, limit) {
        if (!SecretariasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    SecretariasRepository.findById,
                    SecretariasRepository.findByName
                ),
        });
    };

    /**
     * Lista secretarias filtrando pelo estado.
     */
    async findbyEstado(estado, session, page, limit) {
        if (!SecretariasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    estado, page, limit,
                    SecretariasRepository.findbyEstado
                ),
        });
    };

    /**
     * Lista secretarias filtrando pela cidade.
     */
    async findbyCidade(cidade, session, page, limit) {
        if (!SecretariasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    convertString(cidade), page, limit,
                    SecretariasRepository.findbyCidade
                ),
        });
    };

    /**
     * Cria uma nova secretaria.
     * 
     *  Formato passado no body:
     * 
     * {
     *    "NOME": "",
     *    "CIDADE": "",
     *    "ESTADO": "",
     *    "ENDERECO": ""
     *  }
     * 
     */
    async createSecretaria(data, user) {
        if (!SecretariasPolicy.canPost(user)) {
            throw new Erros("Acesso negado", 403);
        };

        await validationsUtils.validate(data, []);
        return await SecretariasRepository.createSecretaria(data);
    };

    /**
     * Atualiza uma secretaria existente.
     * 
     *  Formato passado no body:
     * 
     * {
     *    "NOME": "",
     *    "CIDADE": "",
     *    "ESTADO": "",
     *    "ENDERECO": ""
     *  }
     * 
     */
    async updateSecretaria(id, secretaria, user) {
        if (!SecretariasPolicy.canUpdate(user)) {
            throw new Erros("Acesso negado", 403);
        };

        const registroExistente = await SecretariasRepository.findById(id);
        if (!registroExistente) throw new Erros("ID invalido", 404);

        await validationsUtils.validate(secretaria, []);
        return await SecretariasRepository.updateSecretaria(id, secretaria);
    };

    /**
     * Remove uma secretaria existente.
     */
    async deleteSecretaria(id, user) {
        if (!SecretariasPolicy.canDelete(user)) {
            throw new Erros("Acesso negado", 403);
        };

        const registroExistente = await SecretariasRepository.findById(id);
        if (!registroExistente) throw new Erros("ID invalido", 404);

        return await SecretariasRepository.deleteSecretaria(id);
    };
};

module.exports = new SecretariasService();