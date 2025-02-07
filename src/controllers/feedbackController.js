import { Feedback } from "../model/index.js";

class FeedbackController {
  async getFeedback(req, res) {
    try {
      const { userId } = req;
      const feedback = await Feedback.findOne({ where: { userId } });
      return res.status(200).json({
        status: "success",
        data: feedback,
        message: "",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.message || "Error" });
    }
  }

  async createOrUpdateFeedback(req, res) {
    try {
      const { userId } = req;
      const { content, rate } = req.body;

      if (!content) throw new Error("Vui lòng nhập nội dung đánh giá");
      if (!rate) throw new Error("Vui lòng chọn số sao muốn đánh giá");
      if (rate < 1 || rate > 5)
        throw new Error("Số sao đánh giá phải từ 1 đến 5");
      if (content.length > 1000)
        throw new Error("Nội dung đánh giá không được quá 1000 ký tự");
      const feedback = await Feedback.findOne({ where: { userId } });
      if (feedback) {
        const updateData = await feedback.update(
          { content, rate },
          { returning: true }
        );
        return res.status(200).json({
          status: "success",
          message: "Cập nhật đánh giá thành công",
          data: updateData,
        });
      }

      await Feedback.create({ userId, content, rate });
      return res.status(200).json({
        status: "success",
        message: "Đánh giá thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.message || "Error" });
    }
  }
}

export default new FeedbackController();