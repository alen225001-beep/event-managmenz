const mongoose = require('mongoose');

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/sahrdaya_eventhub';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Warning: Could not connect to MongoDB URI (${uri}): ${err.message}`);

    // If development and in-memory server is desired as fallback
    if (process.env.NODE_ENV === 'test') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[Database] In-memory test MongoDB connected: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.error('[Database] In-memory MongoDB failed:', memErr.message);
      }
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('[Database] Fatal: Cannot start in production without valid MongoDB URI.');
      // Do not crash immediately to allow Render healthcheck diagnostics if needed
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('[Database] Disconnect error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
