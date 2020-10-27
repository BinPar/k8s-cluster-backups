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


  const { treeHash } = glacier.computeChecksums(buffer);

  const partSize = 1024 * 1024; // 1MB chunks,
  let numPartsLeft = Math.ceil(buffer.length / partSize);

  const params = { vaultName: config.vaultName, archiveDescription: fileName, accountId: config.accountId, partSize: partSize.toString() };


  return new Promise<void>((resolve, reject): void => {
    // Call Glacier to initiate the upload.
    glacier.initiateMultipartUpload(params, (err, multipart): void => {
      if (err) {
        logger.error("Error uploading archive!", err);
        reject(err);
      }
      if (multipart.uploadId) {
        logger.info("Got upload ID", multipart.uploadId);

        // Grab each partSize chunk and upload it as a part
        for (let i = 0; i < buffer.length; i += partSize) {
          const end = Math.min(i + partSize, buffer.length);
          const partParams = {
            vaultName: config.vaultName,
            uploadId: multipart.uploadId,
            range: `bytes ${i}-${end - 1}/*`,
            body: buffer.slice(i, end),
            accountId: config.accountId,
          };

          // Send a single part
          logger.info('Uploading part', i, '=', partParams.range);
          // eslint-disable-next-line no-loop-func
          glacier.uploadMultipartPart(partParams, (multiErr): void => {
            if (multiErr) return;
            if (--numPartsLeft > 0) return; // complete only when all parts uploaded

            const doneParams = {
              vaultName: config.vaultName,
              uploadId: multipart.uploadId as string,
              archiveSize: buffer.length.toString(),
              checksum: treeHash,
              accountId: config.accountId,
            };

            logger.info("Completing upload...");
            glacier.completeMultipartUpload(doneParams, (completeErr, data): void => {
              if (completeErr) {
                logger.error(`An error occurred while uploading the archive: ${completeErr}`);
                reject(completeErr);
              } else {
                logger.info('Archive ID:', data.archiveId);
                logger.info('Checksum:  ', data.checksum);
                resolve();
              }
            });
          });
        }
      }
    });
  });
}

export default uploadDatabaseToGlacier;
