const SecuteKnex = require("../../connectionSecute");

module.exports = async function securityControls() {
    const exists = await SecuteKnex.schema.hasTable("security_controls");

    if (!exists) {
        return SecuteKnex.schema.createTable("security_controls", (table) => {
            table.increments("id").primary().unsigned();
            table.string("name", 100).unique();
            table.enum("control_type", ["route", "feature", "ip", "token", "global"]);
            table.string("target_value", 255);
            table.string("http_method", 10).nullable;
            table.boolean("enabled");
            table.text("reason");
            table.dateTime("starts");
            table.dateTime("expires").nullable;
            table.integer("created_by").unsigned;
            table.dateTime("created");
            table.dateTime("updated");
        });
    };
};