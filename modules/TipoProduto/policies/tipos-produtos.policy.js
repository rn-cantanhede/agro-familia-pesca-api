const LevelPolicy = require("../../../shared/policies/level.policy");

class TiposProdutosPolicy {

    static canGet(user) {
        return LevelPolicy.hasAccess(user, [
            LevelPolicy.LEVELS.ADMIN,
            LevelPolicy.LEVELS.SECRETARIA,
            LevelPolicy.LEVELS.ASSOCIACAO,
            LevelPolicy.LEVELS.USUARIO
        ]);
    };

    static canPost(user) {
        return LevelPolicy.hasAccess(user, [
            LevelPolicy.LEVELS.ADMIN,
            LevelPolicy.LEVELS.SECRETARIA,
            LevelPolicy.LEVELS.ASSOCIACAO
        ]);
    };

    static canUpdate(user, targetUser) {
        if (LevelPolicy.isAdmin(user)) return true;

        if (LevelPolicy.isSecretaria(user)) {
            return user.secretaria == targetUser.ID_SECRETARIA;
        };

        return false;
    };

    static canDelete(user, targetUser) {
        return this.canUpdate(user, targetUser);
    };
};

module.exports = TiposProdutosPolicy;