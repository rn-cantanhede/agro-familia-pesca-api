const LevelPolicy = require("../../../shared/policies/level.policy");

class AssociadosPolicy {

    static canGet(user) {
        return LevelPolicy.hasAccess(user, [
            LevelPolicy.LEVELS.ADMIN,
            LevelPolicy.LEVELS.SECRETARIA,
            LevelPolicy.LEVELS.ASSOCIACAO,
            LevelPolicy.LEVELS.USUARIO
        ]);
    }

    static canPost(user) {
        return LevelPolicy.hasAccess(user, [
            LevelPolicy.LEVELS.ADMIN,
            LevelPolicy.LEVELS.SECRETARIA,
            LevelPolicy.LEVELS.ASSOCIACAO
        ]);
    }

    static canUpdate(user, targetUser) {
        if (LevelPolicy.isAdmin(user)) return true;

        if (LevelPolicy.isSecretaria(user)) {
            return user.secretaria == targetUser.ID_SECRETARIA;
        }

        if (LevelPolicy.isAssociacao(user)) {
            return user.associacao == targetUser.ID_ASSOCIACAO;
        }

        return false;
    }

    static canDelete(user, targetUser) {
        return this.canUpdate(user, targetUser);
    }
}

module.exports = AssociadosPolicy;