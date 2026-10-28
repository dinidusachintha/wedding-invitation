import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
const dir = process.env.DATA_DIR || path.join(process.cwd(),'data');
fs.mkdirSync(dir,{recursive:true});
const db = new Database(path.join(dir,'wedding.db'), { timeout: 10000 });
try {
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 10000');
} catch (e) {
  // pragma already set or busy
}
try {
  db.exec(`CREATE TABLE IF NOT EXISTS guests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, token TEXT NOT NULL UNIQUE, seats INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'pending', attending_count INTEGER NOT NULL DEFAULT 0, responded_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE TABLE IF NOT EXISTS wishes (id INTEGER PRIMARY KEY AUTOINCREMENT, guest_id INTEGER NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(guest_id) REFERENCES guests(id));`);
} catch (e) {
  // tables already initialized
}
export default db;
export type Guest = {id:number;name:string;token:string;seats:number;status:'pending'|'accepted'|'declined';attending_count:number;responded_at:string|null;created_at:string};
