import client from '../services/database';
import exceptions from '../data/exceptions.json';
import weekly from '../data/weekly.json';
import logger from '../services/logger';

/**
 * Gets the list of databases in the current mongoDB instance
 */
const getDatabases = async (): Promise<string[]> => {
  try {
    const { databases } = await client.db().admin().listDatabases();
    let databaseNames = databases.map(
      (db: { name: string }): string => db.name,
    );
    const isSunday = new Date().getDay() === 0;
    // We filter only:
    // Not Exceptions and
    // Weekly databases except in Sunday
    databaseNames = databaseNames.filter(
      (name: string): boolean => exceptions.indexOf(name) === -1 && (isSunday || weekly.indexOf(name) === -1),
    );
    return databaseNames;
  } catch (ex) {
    logger.error(ex);
    throw ex;
  }
};
export default getDatabases;
