import backupDatabase from "./backupDatabase";
import deleteDatabaseLocalBackup from "./deleteDatabaseLocalBackup";
import uploadDatabaseToGlacier from "./uploadDatabaseToGlacier";

/**
 * Proceses the entire database backup cycle
 * (local backup, s3 upload and deletion of local files)
 * for a specific database
 * @param databaseName name of the database to process
 */
const processDatabase = async (databaseName: string): Promise<void> => {
  await backupDatabase(databaseName);
  await uploadDatabaseToGlacier(databaseName);
  await deleteDatabaseLocalBackup(databaseName);
}

export default processDatabase;