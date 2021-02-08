import { Webhook } from 'discord-webhook-node';
import config from './config';
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
    const databaseName = databaseNames[index];
    try {
      const start = new Date();
      // We really want to do it as a serial process to avoid
      // stressing de database:
      // eslint-disable-next-line no-await-in-loop
      await processDatabase(databaseName);
      const end = new Date();
      databaseBackupTimes.push({ databaseName, start, end });
    } catch (ex) {
      logger.error(`Error backing up: ${databaseName}()}`);
      if (config.discordBackupWebhook) {
        const hook = new Webhook(config.discordBackupWebhook);
        hook.send(`Error en backups de la base de datos **${databaseName}**:\r\n${ex.toString()}`);
      }
    }
  }

  let backupResult = '';
  let cnt = 0;
  // Log the results
  for (let i = 0; i < databaseBackupTimes.length; i++) {
    const dbt = databaseBackupTimes[i];
    backupResult += `Backup de **${dbt.databaseName}** realizado desde ${dbt.start.toLocaleTimeString()} hasta ${dbt.end.toLocaleTimeString()}\r\n`
    logger.info(`${dbt.databaseName} from ${dbt.start.toLocaleTimeString()} to ${dbt.end.toLocaleTimeString()}`);
    if (++cnt > 9 && config.discordBackupWebhook) {
      const hook = new Webhook(config.discordBackupWebhook);
      // This is intentional, we need the messages to be sent sequentially
      // eslint-disable-next-line no-await-in-loop
      await hook.send(backupResult);
      backupResult = ''
      cnt = 0;
    } 
  }

  if (config.discordBackupWebhook && cnt) {
    const hook = new Webhook(config.discordBackupWebhook);
    await hook.send(backupResult);
  }
  // Close the connection with MongoDB
  await close();
};

main();
