import * as AWS from 'aws-sdk';
import logger from '../services/logger';
import config from '../config';
import getS3FolderName from './getS3FolderName';


const purgeDatabaseBackups = async (databaseName: string): Promise<void> => {
  AWS.config.update({ region: 'eu-west-1' });
  logger.info(`Purging: ${databaseName} to bucket ${config.bucketName}`);
  // Create a new service object and buffer
  const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const s3FolderName = getS3FolderName(databaseName);

  const params = {
    Bucket: config.bucketName,
    Prefix: `${s3FolderName}/`,
    Delimiter: '',
  }

  const listObjectsResponse = await s3.listObjects(params).promise();
  let { Contents: contents } = listObjectsResponse;
  if (contents) {
    // We need to remove the current folder from the list
    contents = contents.filter((_,i): boolean => i > 0);
    // Order from the newer to the older
    contents.sort((a,b): number => a.LastModified! > b.LastModified! ? -1 : 1);
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index];
      // We skip the initial backups
      if (index >= config.maxHistoricalBackups) {
        if (content.Key) {
          logger.info(`Purging historical backup: ${content.Key}...`);
          const deleteParams: AWS.S3.DeleteObjectRequest = {
            Bucket: config.bucketName,
            Key: content.Key,
          };
          // eslint-disable-next-line no-await-in-loop
          await s3.deleteObject(deleteParams).promise();
          logger.info(`... ${content.Key} deleted`);
        }
      }
    }
  }
}
export default purgeDatabaseBackups;