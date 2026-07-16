// ALWAYS load environment variables at the absolute top before loading database configs
require('dotenv').config(); 

const app = require('./app');
const { connectDB, sequelize } = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // 1. Verify connection state across database components
    await connectDB();
    
    // 2. Sync Sequelize models with PostgreSQL tables
    await sequelize.sync({ alter: true });
    console.log('📊 PostgreSQL models synced successfully.');

    // 3. Launch HTTP network socket listener
    app.listen(PORT, () => {
      console.log(`🚀 ResolveAI Backend Server running on port [${PORT}]`);
    });
  } catch (error) {
    console.error('💥 Critical Gateway Initialization Failure:', error.message);
    process.exit(1);
  }
};

startServer();