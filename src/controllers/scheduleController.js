import { Op } from "sequelize";
import Schedule from "../model/Schedule.js";
import removeVietnameseAccents from "../utils/removeVietnameseAccents.js";

class ScheduleController {
  async searchSchedule(req, res) {
    try {
      const { userId } = req;
      const { title = "" } = req.query;
      const listSchedule = await Schedule.findAndCountAll({
        where: {
          userId,
          title: {
            [Op.like]: `%${removeVietnameseAccents(title)}%`,
          },
        },
      });

      return res.status(200).json({
        message: "Tìm kiếm lịch trình thành công",
        status: "success",
        data: listSchedule,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: error.message || "Error" });
    }
  }
  async sortSchedule(req, res) {
    try {
      const { userId } = req;
      let { sortBy = "DESC" } = req.query;
      sortBy = sortBy.toUpperCase();
      const sortByDate = ["ASC", "DESC"];
      if (sortByDate.includes(sortBy)) {
        const listSchedule = await Schedule.findAndCountAll({
          where: {
            userId,
          },
          order: [["createdAt", sortBy]],
        });

        return res.status(200).json({
          message: "Sắp xếp lịch trình thành công",
          status: "success",
          data: listSchedule,
        });
      }
      
     
      
      const listSchedule = await Schedule.findAndCountAll({
        where: {
          userId,
          status: sortBy === "TRUE" ,
        },
      });
      return res.status(200).json({
        status: "success",
        message: "Sắp xếp lịch trình thành công",
        data: listSchedule,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message || "Error",
        data: {
          count: 0,
          rows: [],
        },
      });
    }
  }
  async createSchedule(req, res) {
    try {
      const { userId } = req;
      const { title, content, time, date } = req.body;
      if (!title) throw new Error("Vui lòng nhập tiêu đề lịch trình.");
      if (!content) throw new Error("Vui lòng nội dung lịch trình.");
      if (!time) throw new Error("Vui lòng nhập thời gian lịch trình.");
      if (!date) throw new Error("Vui lòng nhập ngày lịch trình.");

      if (title.length > 255)
        throw new Error("Tiêu đề lịch trình không được vượt quá 255 ký tự.");
      if (content.length > 500)
        throw new Error("Nội dung lịch trình không được vượt quá 500 ký tự.");
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      const dateSchedule = new Date(date);
      if (dateSchedule < today)
        throw new Error("Ngày lịch trình không hợp lệ.");
      if (!isValidTime(time))
        throw new Error("Thời gian lịch trình không hợp lệ.");

      const schedule = await Schedule.create({
        title,
        content,
        time,
        date,
        userId,
      });
      return res.status(200).json({
        status: "success",
        message: "Tạo thành công",
        data: schedule,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.message || "Error" });
    }
  }
  async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req;
      const { title, content, time, date } = req.body;
      if (!title) throw new Error("Vui lòng nhập tiêu đề lịch trình.");
      if (!content) throw new Error("Vui lòng nội dung lịch trình.");
      if (!time) throw new Error("Vui lòng nhập thời gian lịch trình.");
      if (!date) throw new Error("Vui lòng nhập ngày lịch trình.");

      if (title.length > 255)
        throw new Error("Tiêu đề lịch trình không được vượt quá 255 ký tự.");
      if (content.length > 500)
        throw new Error("Nội dung lịch trình không được vượt quá 500 ký tự.");
      const today = new Date();
      const dateSchedule = new Date(date);
      if (dateSchedule < today)
        throw new Error("Ngày lịch trình không hợp lệ.");
      if (!isValidTime(time))
        throw new Error("Thời gian lịch trình không hợp lệ.");

      const schedule = await Schedule.findOne({ where: { id, userId } });
      if (!schedule)
        return res
          .status(404)
          .json({ status: "error", message: "Không tìm thấy lịch trình" });

      schedule.title = title;
      schedule.content = content;
      schedule.time = time;
      schedule.date = date;
      await schedule.save();

      return res.status(200).json({
        status: "success",
        message: "Cập nhật lịch trình thành công",
        data: schedule,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Error" });
    }
  }
  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req;
      const schedule = await Schedule.findOne({ where: { id, userId } });
      if (!schedule)
        return res
          .status(404)
          .json({ status: "error", message: "Schedule not found" });
      await schedule.destroy();

      return res.status(200).json({
        status: "success",
        message: "Xóa lịch trình thành công",
        data: { id },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Error" });
    }
  }
}
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Hàm kiểm tra giờ hợp lệ
function isValidTime(timeString) {
  const regex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
  return regex.test(timeString);
}
export default new ScheduleController();
