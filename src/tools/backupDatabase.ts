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
    if (config.mongoUser && mongoURL.indexOf('mongodb://') !== -1) {
      const mongoBase = mongoURL.split('mongodb://')[1];
      args[0] = '--host';
      args[1] = mongoBase;
      args.push(
        '--authenticationDatabase',
        'admin',
        '--ssl',
        '--username',
        config.mongoUser,
        '--password',
        config.mongoPassword,
        `--db=${databaseName}`);
      // eslint-disable-next-line no-console
      console.log(args);
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
