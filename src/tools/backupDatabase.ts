import { spawn } from 'child_process';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import config from '../config';
import logger from '../services/logger';

const { mongoURL } = config;

const backupDatabase = async (databaseName: string): Promise<void> => {
  return new Promise((resolve, reject): void => {
    AWS.config.update({ region: 'us-west-1' });
    const targetFile = `/data/backups/${databaseName}.gz`;
    const args = [
      '--uri',
      `${mongoURL}/${databaseName}`,
      '--gzip',
      `--archive="${targetFile}"`,
    ];
    const mongodump = spawn('/usr/bin/mongodump', args);
    mongodump.stdout.on('data', (data): void => {
      logger.info(`stdout: ${data}`);
    });
    mongodump.stderr.on('data', (data): void => {
      logger.error(`stderr: ${data}`);
    });
    mongodump.on('exit', (code): void => {
      if (code === 0) {
        // Great code fragment of upload
        // https://gist.githubusercontent.com/masnun/3953dc0213c1fd601466b2b3abbed0ea/raw/ecee9a816d932f29b9600ceccbdae16b21652a6a/upload_to_s3.ts
        fs.unlink(targetFile, (err): void => {
          if (err) {
            reject(new Error(`Error deleting backup: ${err}`));
          } else {
            resolve();
          }
        });
      } else {
        reject(
          new Error(`MongoDump process failed and exit with code ${code}`),
        );
      }
    });
  });
};

export default backupDatabase;
