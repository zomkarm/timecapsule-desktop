const path = require('path');
const Database = require('better-sqlite3');

// Store DB file inside user data directory
//const dbPath = path.join(require('electron').app.getPath('userData'), 'timecapsule.db');
console.log(__dirname);
const dbPath = path.join(__dirname, 'db', 'timecapsule.db');
const db = new Database(dbPath);

// Create diary_entries table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS diary_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date TEXT UNIQUE,
    content TEXT
  );
`).run();

// Functions
function getEntryByDate(date) {
  return db.prepare('SELECT content FROM diary_entries WHERE entry_date = ?').get(date);
}

function saveEntry(date, content) {
  const existing = getEntryByDate(date);
  if (existing) {
    db.prepare('UPDATE diary_entries SET content = ? WHERE entry_date = ?').run(content, date);
  } else {
    db.prepare('INSERT INTO diary_entries (entry_date, content) VALUES (?, ?)').run(date, content);
  }
}

module.exports = {
  getEntryByDate,
  saveEntry,
};
