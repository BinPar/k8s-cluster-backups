import { spawn } from 'child_process';
import config from '../config';
import logger from '../services/logger';
import getDatabaseBackupFileName from './getDatabaseBackupFileName';

const { mongoURL } = config;

const backupDatabase = async (databaseName: string): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const targetFile = getDatabaseBackupFileName(databaseName);
    const args = [
      '--uri',
      `${mongoURL}/${databaseName}`,
      '--gzip',
      `--archive="${targetFile}"`,
    ];
    if (config.mongoUser) {
      args.push(
        '-u',
        config.mongoUser,
        '-p',
        config.mongoPassword);
    }
    const mongodump = spawn('/usr/bin/mongodump', args);
    mongodump.stdout.on('data', (data): void => {
      logger.info(`stdout: ${data}`);
    });
    mongodump.stderr.on('data', (data): void => {
      logger.error(`stderr: ${data}`);
    });
    mongodump.on('exit', (code): void => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`MongoDump process failed and exit with code ${code}`),
        );
      }
    });
  });
};

export default backupDatabase;
