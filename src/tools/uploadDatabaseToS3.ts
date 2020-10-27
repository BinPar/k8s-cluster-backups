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
const uploadDatabaseToS3 = async (databaseName: string): Promise<void> => {
  const targetFile = getDatabaseBackupFileName(databaseName);
  AWS.config.update({ region: 'eu-west-1' });
  logger.info(`Uploading: ${targetFile} to bucket ${config.bucketName}`);

  // Create a new service object and buffer
  const s3bucket = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const fileName = `${databaseName}-${getDateString()}.gz`

  const readStream = fs.createReadStream(targetFile);

  const params: AWS.S3.PutObjectRequest = {
    Bucket: config.bucketName,
    Key: fileName,
    Body: readStream,
    StorageClass: 'ONEZONE_IA',
  };

  return new Promise<void>((resolve, reject): void => {
    s3bucket.upload(params, (err): void => {
      readStream.destroy();
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export default uploadDatabaseToS3;
