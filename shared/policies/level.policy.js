/**
 * Camada de política de acesso responsável por
 * centralizar as regras de permissão do sistema.
 *
 * Atua como uma camada de apoio aos Services,
 * garantindo que apenas usuários autorizados
 * executem determinadas operações.
 */
class LevelPolicy {

    static LEVELS = {
        ADMIN: 1,
        SECRETARIA: 2,
        ASSOCIACAO: 3,
        USUARIO: 4
    };

    /**
     * Verifica se o usuário possui um dos níveis permitidos
     */
    static hasAccess(user, allowedLevels = []) {
        if (!user || !user.nivel) return false;
        return allowedLevels.includes(user.nivel);
    };

    static isAdmin(user) {
        return user?.nivel == this.LEVELS.ADMIN;
    };

    static isSecretaria(user) {
        return user?.nivel == this.LEVELS.SECRETARIA;
    };

    static isAssociacao(user) {
        return user?.nivel == this.LEVELS.ASSOCIACAO;
    };

    static isUsuario(user) {
        return user?.nivel == this.LEVELS.USUARIO;
    };
}

module.exports = LevelPolicy;
