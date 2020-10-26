import client, { close } from '../services/database';
import getDatabases from '../tools/getDatabases';
import config from '../config';
import processDatabase from '../tools/processDatabase';


// Note: This test is designed to run on the dockerfile creation
// that includes a clean mongoDB instance
export default test('Backup DataBase', async (): Promise<void> => {
  // The bucker name must be provided
  expect(config.bucketName).toBeTruthy();
  let databaseNames = await getDatabases();
  // We expect the testing Mongo instance to have no DB 
  expect(databaseNames).toHaveLength(0);

  // We create a database with a testing collection
  const db = client.db('testingDb');
  const collection = db.collection('test');
  await collection.insertOne({ _id: 'test', value: 'JEST Testing Document' });

  // We get the databases again to check that there is one DB
  databaseNames = await getDatabases();
  expect(databaseNames).toHaveLength(1);
  await processDatabase(databaseNames[0]);
  await close();
});
