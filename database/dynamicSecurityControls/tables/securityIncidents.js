const SecuteKnex = require("../../connectionSecute");

module.exports = async function securityIncidents() {
    const exists = await SecuteKnex.schema.hasTable("security_incidents");

    if (!exists) {
        return SecuteKnex.schema.createTable("security_incidents", (table) => {
            table.increments("id").primary().unsigned();
            table.integer("security_event_id").unsigned();
            table.string("title", 255);
            table.text("description");
            table.enum("status", ["open", "investigating", "contained", "resolved"]);
            table.integer("assigned_operator_id").unsigned().nullable();
            table.dateTime("created");
            table.dateTime("resolved").nullable;
        });
    };
};