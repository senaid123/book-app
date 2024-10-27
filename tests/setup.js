import db from "../src/models/index.js";

const setupDatabase = async () => {
  await db.sequelize.sync({ force: true });
};

const cleanupDatabase = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tables = ["Authors", "Books", "BookAuthors"];
  for (const table of tables) {
    await queryInterface.bulkDelete(table, null, {});
  }
};

const initializeTestEnvironment = async () => {
  await setupDatabase();
};

export { initializeTestEnvironment, cleanupDatabase };
