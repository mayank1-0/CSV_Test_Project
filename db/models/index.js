const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: dbConfig.dialect,
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Products = require("../models/Products.model")(sequelize, Sequelize);
const FileProcessing = require("../models/FileProcessing.model")(sequelize, Sequelize);

// P.K - F.K. 0. Foreign key vala baad mein i.e Products
FileProcessing.hasMany(Products, {
  foreignKey: "file_id"
});
Products.belongsTo(FileProcessing, {
  foreignKey: "file_id",
});

db.Products = Products;
db.FileProcessing = FileProcessing;

module.exports = db;
