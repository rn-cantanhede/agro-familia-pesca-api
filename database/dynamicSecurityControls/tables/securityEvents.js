const SecuteKnex = require("../../connectionSecute");

module.exports = async function securityEvents() {
    const exists = await SecuteKnex.schema.hasTable("security_events");

    if (!exists) {
        return SecuteKnex.schema.createTable("security_events", (table) => {
            table.increments("id").primary().unsigned();
            table.string("name", 100).unique();
            table.string("event_type", 255);
            table.enum("severity", ["info", "warning", "high", "critical"]);
            table.string("source_ip", 45);
            table.string("route", 255);
            table.string("http_method", 10);
            table.string("request_id", 100);
            table.json("details");
            table.dateTime("occurred");
        });
    };
};