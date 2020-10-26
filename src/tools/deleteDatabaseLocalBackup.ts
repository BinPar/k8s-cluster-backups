import * as fs from 'fs';
import getDatabaseBackupFileName from './getDatabaseBackupFileName';

/**
 * Deletes the local database backup files
 * @param databaseName name of the database
 */
const deleteDatabaseLocalBackup = async (databaseName: string): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const targetFile = getDatabaseBackupFileName(databaseName);
    fs.unlink(targetFile, (err): void => {
      if (err) {
        reject(new Error(`Error deleting backup: ${err}`));
      } else {
        resolve();
      }
    });
  });
};

export default deleteDatabaseLocalBackup;
