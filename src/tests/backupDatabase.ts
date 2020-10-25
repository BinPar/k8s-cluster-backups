import logger from '../services/logger';
import { close } from '../services/database';
import getDatabases from '../tools/getDatabases';

export default test('Backup DataBase', async (): Promise<void> => {
  const databaseNames = await getDatabases();
  // We expect the testing Mongo instance to have no DB 
  expect(databaseNames).toHaveLength(0);
  logger.info(databaseNames); 
  await close();
});
