const SecuteKnex = require("../connectionSecute");

module.exports = async function securityOperators() {
    const exists = await SecuteKnex.schema.hasTable("security_operators");

    if (!exists) {
        return SecuteKnex.schema.createTable("security_operators", (table) => {
            table.increments("id").primary().unsigned();
            table.string("username", 80).unique();
            table.string("email", 150).unique();
            table.string("password", 255).notNullable;
            table.enum("role", ["owner", "operator", "auditor"]);
            table.enum("status", ["active", "disabled", "locked"]);
            table.dateTime("last_login").nullable;
            table.dateTime("created");
            table.dateTime("updated");
        });
    };
};