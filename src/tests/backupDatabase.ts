import logger from '../services/logger';
import client, { close } from '../services/database';
import getDatabases from '../tools/getDatabases';

export default test('Backup DataBase', async (): Promise<void> => {
  let databaseNames = await getDatabases();
  // We expect the testing Mongo instance to have no DB 
  expect(databaseNames).toHaveLength(0);

  // We create a database with a testing collection
  const db =  client.db('testingDb');
  const collection = db.collection('test');
  await collection.insertOne({_id: 'test', value: 'JEST Testing Document'});
  
  // We get the databases again to check that there is one DB
  databaseNames = await getDatabases();
  expect(databaseNames).toHaveLength(1);

  logger.info(databaseNames); 
  await close();
});
