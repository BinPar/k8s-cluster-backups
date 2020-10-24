import { MongoClient } from 'mongodb';
import logger from './tools/logger';
import exceptions from './data/exceptions.json';

const dbExceptions = exceptions as string[];

const main = async (): Promise<void> => {
  const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
  });
  try {    
    await client.connect();
    const { databases } = await client.db().admin().listDatabases();
    let databaseNames = databases.map((db: {name: string}): string => db.name);
    
    databaseNames = databaseNames.filter((name: string): boolean => dbExceptions.indexOf(name) === -1);

    logger.info(databaseNames); 
  } catch (ex) {
    logger.error(ex);
  } finally {
    await client.close();
  }
};

main();
