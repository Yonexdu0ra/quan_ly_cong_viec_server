import sequelize from "../config/database.js";
import Account from "./Account.js";
import User from "./User.js";
import Job from "./Job.js";

// cấu hình quan hệ giữa các model

User.hasOne(Account, {
  foreignKey: "userId",
});

Account.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Job, {
  foreignKey: "userId",
});

Job.belongsTo(User, {
  foreignKey: "userId",
});

export { User, Account, Job, sequelize };
