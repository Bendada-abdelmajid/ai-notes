import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let { user_version: currentDbVersion } = await db.getFirstAsync<{
        user_version: number;
    }>("PRAGMA user_version");
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        await db.execAsync(`PRAGMA journal_mode = 'wal'; CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT,
          title TEXT,
          desc TEXT,
          date TEXT);
  `);
       
        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
