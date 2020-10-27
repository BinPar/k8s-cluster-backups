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
  let db = client.db('testingDb1');
  let collection = db.collection('test');
  await collection.insertOne({ _id: 'test', value: 'JEST Testing First Document' });

  // We create a second database with a testing collection
  db = client.db('testingDb2');
  collection = db.collection('test2');
  await collection.insertOne({ _id: 'test', value: 'JEST Testing Second Document' });


  // We get the databases again to check that there is two DBs
  databaseNames = await getDatabases();

  expect(databaseNames).toHaveLength(2);

  // We do backup all DBs
  for (let index = 0; index < databaseNames.length; index++) {
    // We really want to do it as a serial process to avoid
    // stressing de database:
    // eslint-disable-next-line no-await-in-loop
    await processDatabase(databaseNames[index]);  
  }

  // Close the connection with MongoDB
  await close();
});
