/**
 * Gets the S3 Bucket folder name for
 * weekly and daily backups
 * @param databaseName Name of the database to upload
 */
const getS3FolderName = (databaseName: string): string => {
  const isSunday = new Date().getDay() === 0;
  const s3FolderName = `${databaseName}${isSunday?'-weekly':''}`;
  return s3FolderName;
}

export default getS3FolderName;