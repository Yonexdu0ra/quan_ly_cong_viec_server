import { User } from "../model/index.js";

class UserController {
  async myInfo(req, res) {
    try {
      const userId = req.userId;
      if (!userId) throw new Error("Nguoi dung khong ton tai.");
      const userData = await User.findOne({ where: { id: userId } });

      return res
        .status(200)
        .json({
          status: "success",
          data: userData,
          message: "Lấy thông tin người dùng thành công.",
        });
    } catch (error) {
      return res
        .status(404)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
}

export default new UserController();
