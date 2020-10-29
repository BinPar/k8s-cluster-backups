import * as AWS from 'aws-sdk';
import logger from '../services/logger';
import config from '../config';


const purgeDatabaseBackups = async (databaseName: string): Promise<void> => {
  AWS.config.update({ region: 'eu-west-1' });
  logger.info(`Purging: ${databaseName} to bucket ${config.bucketName}`);
  // Create a new service object and buffer
  const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const params = { 
    Bucket: config.bucketName,
    Prefix: `${databaseName}/`,
    Delimiter: '',
  }

  const filesInBucketDatabaseFolder = await s3.listObjects(params);
  // eslint-disable-next-line no-console
  console.log(filesInBucketDatabaseFolder);
}

export default purgeDatabaseBackups;