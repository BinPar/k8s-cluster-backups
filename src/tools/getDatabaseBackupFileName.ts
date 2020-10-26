/**
 * Gets the backup file name based on the database name
 * @param {string} databaseName Name of the database
 * @returns {string} backup file name
 */
const getDatabaseBackupFileName = (databaseName: string): string => `/data/backups/${databaseName}.gz`;

export default getDatabaseBackupFileName;
