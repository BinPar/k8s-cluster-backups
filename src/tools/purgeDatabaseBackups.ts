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
  let { Contents: contents } = listObjectsResponse;
  if (contents) {
    // We need to remove the current folder from the list
    contents = contents.filter((_,i): boolean => i > 0);
    // Order from the newer to the older
    contents.sort((a,b): number => a.LastModified! > b.LastModified! ? -1 : 1);
    let result = '';
    for (let index = 0; index < contents.length; index++) {
      const content = contents[index];
      result += `${content.Key}\r\n`
    }
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
export default purgeDatabaseBackups;