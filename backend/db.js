/** Database connection for CalControl. */

const { Client } = require("pg");

const client = new Client(process.env.DATABASE_URL || "postgresql:///calcontrol_test");

client.connect();


module.exports = client;