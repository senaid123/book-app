import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import config from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const currentConfig = config[env];

const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    logging: currentConfig.logging,
  },
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

const modelFiles = fs
  .readdirSync(path.resolve(__dirname, "../models"))
  .filter((file) => file.endsWith(".js") && file !== basename);

for (const file of modelFiles) {
  const modelPath = path.resolve(__dirname, "../models", file);
  const modelURL = pathToFileURL(modelPath).href;
  const model = await import(modelURL);
  const modelInstance = model.default(sequelize, DataTypes);
  db[modelInstance.name] = modelInstance;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
