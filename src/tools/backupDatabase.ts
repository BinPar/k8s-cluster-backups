import { spawn } from 'child_process';
import config from '../config';
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
        '--username',
        config.mongoUser,
        '--password',
        config.mongoPassword,
        `--db=${databaseName}`);
    }
    const mongodump = spawn('/usr/bin/mongodump', args);
    mongodump.stdout.on('data', (data): void => {
      process.stdout.write(data);
    });
    mongodump.stderr.on('data', (data): void => {
      process.stderr.write(data);
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

// Notes for the restore:
// mongorestore --port=27018 --username=root --password=B1nP4r#M0ngo.W0rk --authenticationDatabase=admin --nsFrom "ProENFERMERIALMS.*" --nsTo "pro-enf-beta.*" --gzip --archive=pro-enf.bak 

export default backupDatabase;
