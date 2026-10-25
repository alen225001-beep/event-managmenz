const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_lost_and_found';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // fast failover if local mongo is down
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB URI (${uri}): ${err.message}`);
    
    // In development or test, try in-memory MongoDB fallback for instant zero-config setup
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing fallback in-memory MongoDB server for development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] In-memory MongoDB Connected successfully: ${memoryUri}`);
        return conn;
      } catch (memErr) {
        console.error('[Database] In-memory MongoDB failed to initialize:', memErr.message);
      }
    }

    console.error('[Database] Fatal: Unable to connect to MongoDB. Check MONGODB_URI in your .env file.');
    // Do not exit in test runners or when graceful startup is desired
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
