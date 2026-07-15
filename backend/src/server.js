const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Make sure databases are connected first before accepting user requests
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 ResolveAI Backend Server running on port [${PORT}]`);
  });
};

startServer();