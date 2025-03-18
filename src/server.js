import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import { CronJob } from "cron";
import routes from "./routes/index.js";
import { Schedule, User } from "./model/index.js";
import nodemailer from "nodemailer";
const port = process.env.PORT || 3002;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const job = new CronJob(
  "* * * * *",
  async function () {
    try {
      const listData = await Schedule.findAll({
        raw: true,
      });
      const currentDate = new Date();

      for (const schedule of listData) {
        if (schedule.status) continue;
        const date = new Date(schedule.date);
        const [hours, minute] = schedule.time.split(":");
        date.setHours(hours);
        date.setMinutes(minute);

        if (currentDate < date) continue;

        const userData = await User.findOne({
          where: {
            id: schedule.userId,
          },
        });

        const mailOptions = {
          to: [userData.email],
          subject: "Thông báo từ hệ thống",
          text: schedule.content,
        };
        const data = await transporter.sendMail(mailOptions);

        await Schedule.update(
          {
            status: true,
          },
          {
            where: {
              id: schedule.id,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  null,
  false,
  "Asia/Bangkok"
);
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Ket noi toi database thanh cong");

    job.start();
    // await sequelize.sync({ force: true });
    // console.log('reset all tables successfully');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    return;
  }
})();
