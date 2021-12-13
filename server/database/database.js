const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const configurationTemplate = {
  databaseName: "teacherfinder",
  connectionString: `mongodb://127.0.0.1:27017/`,
};
configurationTemplate.connectionString += configurationTemplate.databaseName;

const CONFIG_PATH = path.join(__dirname, "db-config.json");

fs.fileExists = async function (path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
};

module.exports = class Database {
  static mongoConnection;
  static mongoConfig;
  static async generateConfigurationTemplate() {
    if (!(await fs.fileExists(CONFIG_PATH))) {
      try {
        // se non esiste già creo file di configurazione da template
        await fs.writeFile(CONFIG_PATH, JSON.stringify(configurationTemplate));
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  static async readConfiguration() {
    await Database.generateConfigurationTemplate();
    this.mongoConfig = await fs.readFile(CONFIG_PATH, "utf-8");
    this.mongoConfig = JSON.parse(this.mongoConfig);
  }

  static async connect() {
    if (typeof this.mongoConfig !== "undefined") {
      this.mongoConnection = await mongoose.connect(
        this.mongoConfig.connectionString
      );
      return this.mongoConnection;
    } else throw new Error("Nessuna configurazione caricata!");
  }

  static isConnected() {
    return typeof Database.mongoConnection !== "undefined";
  }
};
