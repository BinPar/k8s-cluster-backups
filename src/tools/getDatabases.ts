import client from '../services/database';
import exceptions from '../data/exceptions.json';
import logger from '../services/logger';

// System databases that do not require backup
const dbExceptions = exceptions as string[];

/**
 * Gets the list of databases in the current mongoDB instance
 */
const getDatabases = async (): Promise<string[]> => {
  try {    
    const { databases } = await client.db().admin().listDatabases();
    let databaseNames = databases.map((db: {name: string}): string => db.name);
    databaseNames = databaseNames.filter((name: string): boolean => dbExceptions.indexOf(name) === -1);
    return databaseNames;
  } catch (ex) {
    logger.error(ex);
    throw ex;
  }
};
export default getDatabases;