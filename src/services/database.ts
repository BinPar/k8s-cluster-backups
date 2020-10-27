import { MongoClient, MongoClientOptions } from 'mongodb';
import logger from './logger';
import config from '../config';

const { mongoURL } = config;

const options: MongoClientOptions = {
  useUnifiedTopology: true,
};

if (config.mongoUser) {
  options.auth = {
    user: config.mongoUser,
    password: config.mongoPassword,
  };
}

/**
 * MongoDB Client
 */
const client = new MongoClient(mongoURL, options);



/**
 * Connects to the mongo DataBase
 */
const connect = async (): Promise<void> => {
  try {
    logger.verbose(`Connecting to database ${mongoURL}...`);
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