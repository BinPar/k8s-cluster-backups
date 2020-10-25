import { MongoClient } from 'mongodb';
import logger from './logger';

const mongURL = 'mongodb://localhost:27017';

/**
 * MongoDB Client
 */
const client = new MongoClient(mongURL, {
  useUnifiedTopology: true,
});

/**
 * Connects to the mongo DataBase
 */
const connect = async (): Promise<void> => {
  try {
    logger.verbose(`Connecting to database ${mongURL}...`);    
    await client.connect();
    logger.info('Connected to the database');
  } catch (ex) {
    logger.error(ex);
  }
};

connect();

export default client;

/**
 * Closes the connection with the Mongo DataBase
 */
export const close = async (): Promise<void> => {
  try {
    logger.verbose('Disconnecting from database...');
    await client.close();
    logger.info('Database disconnected');
  } catch (ex) {
    logger.error(ex);
  }
}