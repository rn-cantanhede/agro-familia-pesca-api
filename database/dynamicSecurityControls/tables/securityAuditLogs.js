const SecuteKnex = require("../../connectionSecute");

module.exports = async function securityAuditLogs() {
    const exists = await SecuteKnex.schema.hasTable("security_audit_logs");

    if (!exists) {
        return SecuteKnex.schema.createTable("security_audit_logs", (table) => {
            table.increments("id").primary().unsigned();
            table.integer("operator_id").unsigned().nullable;
            table.integer("control_id").unsigned().nullable;
            table.string("action", 80);
            table.string("target_type", 50);
            table.string("target_id", 100).nullable;
            table.boolean("success");
            table.string("ip_address", 45);
            table.json("details");
            table.dateTime("created");
        });
    };
};