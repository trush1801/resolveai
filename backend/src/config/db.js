const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// Create the connection client instance for PostgreSQL
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false, // Keeps our console logs clean
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

const connectDB = async () => {
  try {
    // Connect to MongoDB (For flexible Chat logs)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🛡️  ResolveAI MongoDB connected successfully.');

    // Connect to PostgreSQL (For strict relational tickets)
    await sequelize.authenticate();
    console.log('🛡️  ResolveAI PostgreSQL connected successfully.');
    
    // Safety sync database tables to match our code models automatically
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('❌ Database connection failure:', error.message);
    process.exit(1); // Stop the server immediately if DB breaks
  }
};

module.exports = { connectDB, sequelize };