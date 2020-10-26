import logger from './services/logger';
import client, { close } from './services/database';
import exceptions from './data/exceptions.json';

const dbExceptions = exceptions as string[];

const main = async (): Promise<void> => {
  try {
    const { databases } = await client.db().admin().listDatabases();
    let databaseNames = databases.map(
      (db: { name: string }): string => db.name,
    );
    databaseNames = databaseNames.filter(
      (name: string): boolean => dbExceptions.indexOf(name) === -1,
    );
    logger.info(databaseNames);
  } catch (ex) {
    logger.error(ex);
  } finally {
    await close();
  }
};

main();
