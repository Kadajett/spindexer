import { promises as fs } from 'fs';

import { Record, DBClient, Query } from './db';

const DB_FILE = process.cwd() + '/localdb/db.json';
const INITIAL_DB = {
  nfts: [],
  artists: [],
  tracks: [],
  processors: {
    createTracksFromNFTs: {
      cursor: process.env.GLOBAL_STARTING_BLOCK,
    }
  },
  indexes: {
    nfts: {},
    artists: {},
    tracks: {},
  }
};

const loadDB = async () => {
  try {
    const data = await fs.readFile(DB_FILE);
    return JSON.parse(data.toString());
  } catch (error: any) {
    if (error.code && error.code === 'ENOENT') {
      const data = await createDB();
      return data;
    } else {
      throw error;
    }
  };
}

const createDB = async () => {
  await saveDB(INITIAL_DB);
  return INITIAL_DB;
};

const saveDB = async (contents: any) => {
  await fs.writeFile(DB_FILE, JSON.stringify(contents));
};

const init = async (): Promise<DBClient> => {
  const db = await loadDB();
  return {
    getCursor: async (processor: string): Promise<(number | undefined)> => {
      return parseInt(db.processors[processor].cursor);
    },
    getRecords: async (tableName: string, query?: Query): (Promise<Record[]>) => {
      const allRecords = db[tableName]
      if (query) {
        return allRecords.filter((record: Record) => record[query.where.key as keyof Record] === query.where.value);
      }
      return allRecords;
    },
    insert: async (tableName: string, rows: Record[]) => {
      const table = db[tableName];
      const index = db.indexes[tableName];
      rows.forEach((row: Record) => {
        index[row.id] = row;
        return row;
      });
      table.push(...rows);
      await saveDB(db);
    },
    updateProcessor: async (processor: string, newProcessedDBBlock: Number) => {
      db.processors[processor].cursor = newProcessedDBBlock;
      await saveDB(db);
    },
    getNumberRecords: (tableName: string) => {
      return db[tableName].length;
    },
    recordExists: (tableName: string, recordID: string) => {
      return Promise.resolve(!!(db.indexes[tableName][recordID]));
    }
  };
}

export default {
  init
};
