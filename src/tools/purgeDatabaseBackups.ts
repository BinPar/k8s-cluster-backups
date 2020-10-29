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

  const listObjectsResponse = await s3.listObjects(params).promise();
  const { Contents: contents } = listObjectsResponse;
  if (contents) {
    contents.sort((a,b): number => a.LastModified! > b.LastModified! ? 1 : -1);
    for (let index = 1; index < contents.length; index++) {
      const content = contents[index];
      console.log(content.Key);
    }
  }
}

export default purgeDatabaseBackups;