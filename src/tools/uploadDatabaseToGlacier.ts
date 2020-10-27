import * as AWS from 'aws-sdk';
import fs from 'fs';
import logger from '../services/logger';
import getDatabaseBackupFileName from './getDatabaseBackupFileName';
import config from '../config';
import getDateString from './getDateString';

/**
 * Uploads local database backup file to the S3 Bucket
 * @param databaseName Name of the database to upload
 */
const uploadDatabaseToGlacier = async (databaseName: string): Promise<void> => {
  const targetFile = getDatabaseBackupFileName(databaseName);
  AWS.config.update({ region: 'eu-west-1' });
  logger.info(`Uploading: ${targetFile} to vault ${config.vaultName}`);

  // Create a new service object and buffer
  const glacier = new AWS.Glacier({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    apiVersion: '2012-06-01'
  });

  const buffer = await fs.promises.readFile(targetFile);
  const fileName = `${databaseName}-${getDateString()}.gz`
  const params = { vaultName: config.vaultName, archiveDescription: fileName, body: buffer, accountId: '402083338966' };

  return new Promise<void>((resolve, reject): void => {
    // Call Glacier to upload the archive.
    glacier.uploadArchive(params, (err, data): void => {
      if (err) {
        logger.error("Error uploading archive!", err);
        reject(err);
      } else {
        logger.info("Archive ID", data.archiveId);
        resolve();
      }
    });
  });
}

export default uploadDatabaseToGlacier;
