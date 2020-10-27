export default {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  bucketName: process.env.BUCKET_NAME || '',  
  accessKeyId: process.env.ACCESS_KEY_ID || '',  
  secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  accountId:  process.env.ACCOUNT_ID || '',
};
