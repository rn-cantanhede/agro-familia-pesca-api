const Erros = require("../../shared/errors/Errors");
const CategoriasPolicy = require("./policies/categorias.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const associadosRepository = require("../Associados/associados.repository");
const CategoriasRepository = require("./categorias.repository");
const { findByIdName } = require("../../shared/Utils/findUtils");

/**
 * Camada de serviço responsável pela regra de negócio
 * relacionada à entidade Categoria.
 *
 * Atua como intermediária entre o Controller e o Repository,
 * aplicando validações, consistência de dados e regras
 * antes de qualquer operação de persistência.
 */

class CategoriasService {

    /**
     * Retorna todas as categorias cadastradas.
     */

    async findAllCategorias(session, page, limit) {
        if (!CategoriasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return await CategoriasRepository.findAllCategorias(page, limit);
    };

    /**
     * Busca uma categoria por ID ou Nome.
     */

    async find(value, session, page, limit) {
        if (!CategoriasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return await findByIdName(
            value,
            page, 
            limit,
            CategoriasRepository.findById,
            CategoriasRepository.findByName
        );
    };

    /**
     * Cria uma nova categoria após validação dos dados.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": ""
     * }
     * 
     */

    async createCategoria(data, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!CategoriasPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [];

        // Executa todas as validações definidas
        await validationsUtils.validate(data, validations);

        // Insere no banco de dados
        return await CategoriasRepository.createCategoria(data);
    };

    /**
     * Atualiza uma categoria existente.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": ""
     * }
     * 
     */

    async updateCategoria(id, categoria, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!CategoriasPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Verifica se existe antes de atualizar
        const idCategoria = await CategoriasRepository.findById(id);

        if (!idCategoria) {
            throw new Erros("ID não existente", 404);
        };

        // Lista de validações que devem ser aplicadas
        const validations = [];

        // Valida dependências antes da inserção
        await validationsUtils.validate(categoria, validations);

        // Aplica a atualização no banco de dados
        return await CategoriasRepository.updateCategoria(id, categoria);
    };

    /**
     * Remove uma categoria existente.
     */

    async deleteCategoria(id, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!CategoriasPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Verifica se existe na tabela real antes de excluir
        const idCategoria = await CategoriasRepository.findById(id);

        if (!idCategoria) {
            throw new Erros("ID não existente", 404);
        };

        // Remove definitivamente
        return await CategoriasRepository.deleteCategoria(id);
    };
};

module.exports = new CategoriasService();