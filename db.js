const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const file = path.join(__dirname, "db", "data.json");
const adapter = new JSONFile(file);

const defaultData = { users: [] };
const db = new Low(adapter, defaultData);

async function initDb() {
  await db.read();
  db.data ||= defaultData;
}

module.exports = { db, initDb };
