const LevelPolicy = require("../../../shared/policies/level.policy");

class SecretariasPolicy {

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
        ]);
    };

    static canUpdate(user) {
        if (LevelPolicy.isAdmin(user)) return true;

        return false;
    };

    static canDelete(user) {
        return this.canUpdate(user);
    };
}

module.exports = SecretariasPolicy;