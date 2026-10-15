const Erros = require("../../shared/errors/Errors");
const LocalizacaoPolicy = require("./policies/localizacao.policy");
const validationsUtils = require("../../shared/Utils/validationsUtils");
const associadosRepository = require("../Associados/associados.repository");
const LocalizacaoBeneficiadoRepository = require("./localizacao-beneficiado.repository");
const { findByIdName, findByScope } = require("../../shared/Utils/findUtils");
const baseScope = require("../../shared/base/baseScope");

/**
 * Service responsável pela regra de negócio
 * relacionada à localização dos beneficiados.
 *
 * Atua como intermediário entre o controller
 * e o repositório, aplicando validações e
 * tratamento de erros.
 */

class LocalizacaoBeneficiadoService {

    /**
     * Retorna todas as localizações beneficiadas.
     */

    async findAllLocalizacao(session, page, limit) {
        if (!LocalizacaoPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        return baseScope.getAll(session, page, limit, {
            admin: LocalizacaoBeneficiadoRepository.findAllLocalizacao,
            secretaria: LocalizacaoBeneficiadoRepository.findByIdSecretaria,
            associacao: LocalizacaoBeneficiadoRepository.findByIdAssociacao,
            usuario: LocalizacaoBeneficiadoRepository.findById
        });
    };

    /**
     * Busca uma localização beneficiada por ID ou Nome.
     */

    async find(value, session, page, limit) {
        if (!LocalizacaoPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    value,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findById,
                    LocalizacaoBeneficiadoRepository.findByName
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
                    LocalizacaoBeneficiadoRepository.findByIdScope,
                    LocalizacaoBeneficiadoRepository.findByNameScope
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
                    LocalizacaoBeneficiadoRepository.findByIdScope,
                    LocalizacaoBeneficiadoRepository.findByNameScope
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[2],
                    "ID",
                    "NOME",
                    value,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findByIdScope,
                    LocalizacaoBeneficiadoRepository.findByNameScope
                ),
        });
    };

    /**
     * Busca localizações beneficiadas filtrando
     * pelo nome da associação.
     */

    async findbyAssociacao(associacao, session, page, limit) {
        if (!LocalizacaoPolicy.canGet(session)) {
            throw new Erros("Acesso negado", 403);
        };

        const sessionField = ["ID_SECRETARIA", "ID_ASSOCIACAO", "ID"];

        return baseScope.getFind(session, page, limit, {
            admin: () =>
                findByIdName(
                    associacao,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findByIdAssociacao,
                    LocalizacaoBeneficiadoRepository.findbyAssociacao
                ),

            secretaria: (id) =>
                findByScope(
                    id,
                    sessionField[0],
                    "ID_ASSOCIACAO",
                    "ASSOCIACAO",
                    associacao,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findByIdAssociacaoScope,
                    LocalizacaoBeneficiadoRepository.findByNameAssociacaoScope
                ),

            associacao: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID_ASSOCIACAO",
                    "ASSOCIACAO",
                    associacao,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findByIdScope,
                    LocalizacaoBeneficiadoRepository.findByNameScope
                ),

            usuario: (id) =>
                findByScope(
                    id,
                    sessionField[1],
                    "ID_ASSOCIACAO",
                    "ASSOCIACAO",
                    associacao,
                    page, 
                    limit,
                    LocalizacaoBeneficiadoRepository.findByIdScope,
                    LocalizacaoBeneficiadoRepository.findByNameScope
                ),
        });
    };

    /**
     * Cria uma nova localização beneficiada.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_ASSOCIADO": "",
     *   "LATITUDE": "",
     *   "LONGITUDE": "",
     *   "TITULO": "",
     *   "DESCRICAO": "",
     * }
     * 
     */

    async createlocalizacao(localizacao, user) {
        const targetUser = await LocalizacaoBeneficiadoRepository.findByIdSecretaria(user.secretaria);

        if (!LocalizacaoPolicy.canPost(user, targetUser.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas antes da inserção
        const validations = [
            {
                field: "ID_ASSOCIADO",
                validation: LocalizacaoBeneficiadoRepository.findID_ASSOCIADO,
                errorMsg: "ID_ASSOCIADO invalido"
            },
        ];

        // Executa todas as validações definidas
        await validationsUtils.validate(localizacao, validations);

        // Insere no banco de dados
        return await LocalizacaoBeneficiadoRepository.createLocalizacao(localizacao);
    };

    /**
     * Atualiza uma localização beneficiada existente.
     * 
     * Formato passado no body:
     * 
     * {
     *   "ID_ASSOCIADO": "",
     *   "LATITUDE": "",
     *   "LONGITUDE": "",
     *   "TITULO": "",
     *   "DESCRICAO": "",
     * }
     * 
     */

    async updateLocalizacao(id, localizacao, user) {
        // Verifica existe antes de atualizar
        const idLocalizacao = await LocalizacaoBeneficiadoRepository.findById(id);

        if (!idLocalizacao) {
            throw new Erros("ID invalido", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!LocalizacaoPolicy.canUpdate(Alluser, idLocalizacao.result)) {
            throw new Erros("Acesso negado", 403);
        };

        // Lista de validações que devem ser aplicadas
        const validations = [
            {
                field: "ID_ASSOCIADO",
                validation: LocalizacaoBeneficiadoRepository.findID_ASSOCIADO,
                errorMsg: "ID_ASSOCIADO invalido"
            },
        ];

        // Executa as validações
        await validationsUtils.validate(localizacao, validations);

        // Atualiza o programa no banco
        return await LocalizacaoBeneficiadoRepository.updateLocalizacao(id, localizacao);
    };

    /**
     * Remove uma localização beneficiada.
     */

    async deleteLocalizacao(id, user) {

        // Verifica se o programa existe na tabela real antes de excluir
        const idLocalizacao = await LocalizacaoBeneficiadoRepository.findById(id);

        if (!idLocalizacao) {
            throw new Erros("ID não existente", 404);
        };

        const targetUser = await associadosRepository.findByIdPessoa(user.id);

        const Alluser = {
            id: user.id,
            login: user.login,
            nivel: user.nivel,
            secretaria: user.secretaria,
            associacao: targetUser.result.ID_ASSOCIACAO
        };

        if (!LocalizacaoPolicy.canDelete(Alluser, idLocalizacao)) {
            throw new Erros("Acesso negado", 403);
        };

        // Remove definitivamente
        return await LocalizacaoBeneficiadoRepository.deleteLocalizacao(id);
    };
};

module.exports = new LocalizacaoBeneficiadoService();