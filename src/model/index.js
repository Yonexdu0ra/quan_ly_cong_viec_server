import sequelize from "../config/database.js";
import Account from "./Account.js";
import User from "./User.js";
import Job from "./Job.js";
import Schedule from "./Schedule.js";
import Feedback from "./Feedback.js";
// cấu hình quan hệ giữa các model

User.hasOne(Account, {
  foreignKey: "userId",
});
User.hasOne(Feedback, {
  foreignKey: "userId",
});
Feedback.belongsTo(User, {
  foreignKey: "userId",
});
Account.belongsTo(User, {
  foreignKey: "userId",
});
User.hasMany(Schedule, {
  foreignKey: "userId",
});
User.hasMany(Job, {
  foreignKey: "userId",
});
Schedule.belongsTo(User, {
  foreignKey: "userId",
});
Job.belongsTo(User, {
  foreignKey: "userId",
});

// sequelize.query("CREATE EXTENSION IF NOT EXISTS unaccent;");

export { Schedule, Feedback, User, Account, Job, sequelize };
