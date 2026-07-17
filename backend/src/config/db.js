const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// 1. Initialize PostgreSQL connection via Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries in dev
});

// 2. Initialize MongoDB connection via Mongoose
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🛡️  ResolveAI MongoDB: Connected successfully via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const connectDBs = async () => {
  try {
    // Authenticate PostgreSQL
    await sequelize.authenticate();
    console.log("🛡️  ResolveAI PostgreSQL: Connected successfully via Sequelize");
    
    // Sync models if needed (safeguard)
    await sequelize.sync({ alter: true });
    
    // Connect MongoDB
    await connectMongoDB();
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDBs };