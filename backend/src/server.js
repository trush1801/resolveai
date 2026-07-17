// ALWAYS load environment variables at the absolute top before loading database configs
require('dotenv').config(); 

// Fixed path: since server.js is inside src/, app is just in the same directory!
const app = require('./app');
const { connectDBs } = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // 1. Verify connection state across both PostgreSQL (Sequelize) and MongoDB (Mongoose) components
    await connectDBs();

    // 2. Launch HTTP network socket listener
    app.listen(PORT, () => {
      console.log(`🚀 Resolve-AI Backend Server running on port [${PORT}]`);
    });
  } catch (error) {
    console.error('💥 Critical Gateway Initialization Failure:', error.message);
    process.exit(1);
  }
};

startServer();