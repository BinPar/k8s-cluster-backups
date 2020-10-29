import { close } from './services/database';
import logger from './services/logger';
import getDatabases from "./tools/getDatabases";
import processDatabase from "./tools/processDatabase";

const main = async (): Promise<void> => {
  // Get all the databases in the system
  const databaseNames = await getDatabases();
  interface DatabaseBackupTimes {
    start: Date;
    end: Date;
    databaseName: string;
  }
  const databaseBackupTimes = new Array<DatabaseBackupTimes>();
  
  // We do backup all DBs
  for (let index = 0; index < databaseNames.length; index++) {
    const databaseName = databaseNames[index]
    const start = new Date();
    // We really want to do it as a serial process to avoid
    // stressing de database:
    // eslint-disable-next-line no-await-in-loop
    await processDatabase(databaseName);
    const end = new Date();
    databaseBackupTimes.push({ databaseName, start, end });
  }

  // Log the results
  databaseBackupTimes.forEach((dbt): void => {
    logger.info(`${dbt.databaseName} from ${dbt.start.toLocaleTimeString()} to ${dbt.end.toLocaleTimeString()}`);
  });

  // Close the connection with MongoDB
  await close();
};

main();
