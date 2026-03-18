import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Hello migrations @", __dirname);

console.log("Connect DB");

const db = new sqlite3.Database(".data/app.db");

const scriptRoot = "../sql/";
const scripts = [
  "create-notes.sql",
  "create-readings.sql",
  "create-users.sql",
  "insert-readings.sql",
];

scripts.forEach(async (sf) => {
  const filepath = path.resolve(__dirname, scriptRoot, sf);
  console.log("Run", sf, filepath);

  const sqlContent = await fs.promises.readFile(filepath, "utf8");
  db.exec(sqlContent);
});
