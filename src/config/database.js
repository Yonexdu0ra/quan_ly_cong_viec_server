import { Sequelize } from "sequelize";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";




const __dirname = dirname(fileURLToPath(import.meta.url));

const pathFileCA = fs
  .readFileSync(
    `${__dirname.split("\\").slice(0, -1).join("\\")}\\ssl\\ca.pem`
  )
  .toString();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    port: process.env.DATABASE_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        ca: pathFileCA,
      },
      // charset: "utf8",
      charset: "utf8mb4_unicode_ci",
      // collate: "utf8mb4_unicode_ci", // Chỉ định collation cho cơ sở dữ liệu
    },
    timezone: "+07:00",
  }
);

export default sequelize;
