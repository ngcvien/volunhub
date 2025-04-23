import { sequelize } from '../config/database.config';
import setupAssociations from '../models/associations';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database Connected: ${sequelize.config.database} on host ${sequelize.config.host}`);

    setupAssociations();

    // await sequelize.sync({ alter: true });
    console.log("Models synchronized successfully.");

  } catch (error) {
    console.error('❌ Unable to connect to the database or setup associations:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };