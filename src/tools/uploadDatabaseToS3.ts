import * as AWS from 'aws-sdk';
import logger from '../services/logger';
import getDatabaseBackupFileName from './getDatabaseBackupFileName';
import config from '../config';

/**
 * Uploads local database backup file to the S3 Bucket
 * @param databaseName Name of the database to upload
 */
const uploadDatabaseToS3 = async (databaseName: string): Promise<void> => {
  const targetFile = getDatabaseBackupFileName(databaseName);
  AWS.config.update({ region: 'us-west-1' });
  logger.info(`Uploading: ${targetFile} to bucket ${config.bucketName}`);
  // Great code fragment of upload
  // https://gist.githubusercontent.com/masnun/3953dc0213c1fd601466b2b3abbed0ea/raw/ecee9a816d932f29b9600ceccbdae16b21652a6a/upload_to_s3.ts
}

export default uploadDatabaseToS3;
