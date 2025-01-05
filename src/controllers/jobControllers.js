import { Op } from "sequelize";
import { Job } from "../model/index.js";

class JobController {
  async searchJob(req, res) {
    try {
      const userId = req.userId;
      let { jobName = "", status = "", sortBy, order } = req.query;
      status = status.toUpperCase();
      if (!["ASC", "DESC"].includes(order)) {
        order = "DESC";
      }
      if (!["status", "createdAt"].includes(sortBy)) {
        sortBy = "createdAt";
      }
      if (["PENDING", "ONGOING", "COMPLETED"].includes(status)) {
        const jobs = await Job.findAndCountAll({
          where: {
            userId,

            jobName: { [Op.like]: `%${jobName}%` },
            status,
          },
          order: [[sortBy || "createdAt", order || "DESC"]],
        });

        return res.status(200).json({
          status: "success",
          data: jobs,
          message: "Tìm công việc thành công.",
        });
      }
      const jobs = await Job.findAndCountAll({
        where: {
          userId,
          jobName: { [Op.like]: `%${jobName}%` },
        },
        order: [[sortBy || "createdAt", order || "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        data: jobs,
        message: "Tìm công việc thành công.",
      });
    } catch (error) {
      return res
        .status(404)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async getJobById(req, res) {
    try {
      const { id } = req.query;
      const job = await Job.findOne({ where: { id } });
      if (!job) throw new Error("Không tìm thấy công việc");

      return res.status(200).json({
        status: "success",
        data: job,
        message: "Tìm công việc thành công.",
      });
    } catch (error) {
      return res
        .status(404)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async createJob(req, res) {
    try {
      const { jobName, jobDescription } = req.body;
      const userId = req.userId;
      const job = await Job.create({ jobName, jobDescription, userId });

      return res.status(201).json({
        status: "success",
        data: job,
        message: "Tạo công việc thành công.",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async updateJob(req, res) {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Cập nhật công việc thất bại.");
      const { jobName, jobDescription, status } = req.body;
      const userId = req.userId;
      const job = await Job.findOne({ where: { id } });
      if (!job) throw new Error("Cập nhật công việc thất bại.");

      job.jobName = jobName;
      job.jobDescription = jobDescription;
      job.status = status;
      job.userId = userId;

      await job.save();

      return res.status(200).json({
        status: "success",
        data: job,
        message: "Cập nhật công việc thành công.",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      if (!id) throw new Error("Xoá công việc thất bại.");
      const job = await Job.findOne({ where: { id } });
      if (!job) throw new Error("Xoá công việc thất bại.");

      await job.destroy();

      return res
        .status(200)
        .json({ status: "success", message: "Xóa công việc thành công." });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
}

export default new JobController();
