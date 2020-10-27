import { close } from './services/database';
import getDatabases from "./tools/getDatabases";
import processDatabase from "./tools/processDatabase";

const main = async (): Promise<void> => {
  // Get all the databases in the system
  const databaseNames = await getDatabases();
  // We do backup all DBs
  for (let index = 0; index < databaseNames.length; index++) {
    // We really want to do it as a serial process to avoid
    // stressing de database:
    // eslint-disable-next-line no-await-in-loop
    await processDatabase(databaseNames[index]);
  }

  // Close the connection with MongoDB
  await close();
};

main();
