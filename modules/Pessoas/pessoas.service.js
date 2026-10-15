const Erros = require("../../shared/errors/Errors");
const PessoasPolicy = require("./policies/pessoas.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const PessoasRepository = require("./pessoas.repository");
const associadosRepository = require("../Associados/associados.repository");
const { find, findByInterval, findByIdName, findByScope, findByIntervalScope } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

class PessoasService {
    /**
     * Retorna a lista completa de pessoas.
     */

    /**
     * A consulta foi feita na tabela Associado,
     * pois tem como filtrar os dados por associacao
     * e secretaria, diferente da tabela Pessoa
     */
    async findAllPessoas(session, page, limit) {
        if (!PessoasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: PessoasRepository.findAllPessoas,
            secretaria: PessoasRepository.findByIdSecretaria,
            associacao: PessoasRepository.findByIdAssociacaao,
            usuario: PessoasRepository.findById
        });
    };

    /**
     * Busca uma pessoa pelo ID ou pelo nome.
     */

    async find(value, session, page, limit) {
        if (!PessoasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page,
                    limit,
                    PessoasRepository.findById,
                    PessoasRepository.findByName
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID",
                    "NOME",
                    value,
                    page,
                    limit,
                    PessoasRepository.findByIdScope,
                    PessoasRepository.findByNameScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID",
                    "NOME",
                    value,
                    page,
                    limit,
                    PessoasRepository.findByIdScope,
                    PessoasRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca pessoas filtrando pelo gênero.
     */

    async findbyGenero(genero, session, page, limit) {
        if (!PessoasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    genero,
                    page,
                    limit,
                    PessoasRepository.findbyGenero
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID",
                    "GENERO",
                    genero,
                    page,
                    limit,
                    PessoasRepository.findByGeneroScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID",
                    "GENERO",
                    genero,
                    page,
                    limit,
                    PessoasRepository.findByGeneroScope
                ),
        });
    };

    /**
     * Busca pessoas pela data de nascimento.
     */

    async findbyData(data, session, page, limit) {
        if (!PessoasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                find(
                    data,
                    page,
                    limit,
                    PessoasRepository.findbyData
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "DATA_NASCIMENTO",
                    "DATA_NASCIMENTO",
                    data,
                    page,
                    limit,
                    PessoasRepository.findByDataScope,
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "DATA_NASCIMENTO",
                    "DATA_NASCIMENTO",
                    data,
                    page,
                    limit,
                    PessoasRepository.findByDataScope
                ),
        });
    };

    /**
     * Busca pessoas dentro de um intervalo de datas de nascimento.
     */

    async findByInicioFim(inicio, fim, session, page, limit) {
        if (!PessoasPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByInterval(
                    inicio,
                    fim,
                    page,
                    limit,
                    PessoasRepository.findByInicioFim
                ),

            secretaria: (id) =>
                findByIntervalScope(
                    id,
                    sessionField[0],
                    "DATA_NASCIMENTO",
                    inicio,
                    fim,
                    page,
                    limit,
                    PessoasRepository.findByInicioFimScope,
                ),

            associacao: (id) =>
                findByIntervalScope(
                    id,
                    sessionField[1],
                    "DATA_NASCIMENTO",
                    inicio,
                    fim,
                    page,
                    limit,
                    PessoasRepository.findByInicioFimScope,
                ),
        });
    };

    /**
     * Cria um novo registro de pessoa após validação dos dados.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "CPF": "",
     *   "GENERO": "",
     *   "DATA_NASCIMENTO": ""
     * }
     * 
     */

    async createPessoa(data, user) {
        const targetUser = await associadosRepository.findByIdSecretaria(user.secretaria);

        if (!PessoasPolicy.canPost(user, targetUser)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [];

        // Executa todas as validações definidas
        await validationsUtils.validate(data, validations);

        // Insere no banco de dados
        return await PessoasRepository.createPessoa(data);
    };

    /**
     * Atualiza os dados de uma pessoa existente.
     * 
     * Formato passado no body:
     * 
     * {
     *   "NOME": "",
     *   "CPF": "",
     *   "GENERO": "",
     *   "DATA_NASCIMENTO": ""
     * }
     * 
     */

    async updatePessoa(id, pessoa, user) {
        // Verifica se existe antes de atualizar
        const idPessoa = await PessoasRepository.findId(id);

        if (!idPessoa) {
            throw new Erros("ID inválido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: null,
            associacao: null
        };

        if (!PessoasPolicy.canUpdate(Alluser, targetUser)) {
            throw new Erros("Acesso negado", 403);
        };

        // Verifica se existe antes de atualizar
        const validations = [];

        // Executa as validações
        await validationsUtils.validate(pessoa, validations);

        // Aplica a atualização no banco de dados
        return await PessoasRepository.updatePessoa(id, pessoa);
    };

    /**
     * Remove uma pessoa pelo ID.
     */

    async deletePessoa(id, user) {
        // Verifica se o programa existe na tabela real antes de excluir
        const idPessoa = await PessoasRepository.findId(id);

        if (!idPessoa) {
            throw new Erros("ID não existe", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        // Solução provisória
        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: null,
            associacao: null
        };

        if (!PessoasPolicy.canDelete(Alluser, targetUser)) {
            throw new Erros("Acesso negado", 403);
        };

        // Remove definitivamente
        return await PessoasRepository.deletePessoa(id);
    };
};

module.exports = new PessoasService();