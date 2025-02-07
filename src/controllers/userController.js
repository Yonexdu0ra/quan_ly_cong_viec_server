import { Account, User } from "../model/index.js";

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
  async changePassword(req, res) {
    try {
      const userId = req.userId;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if(newPassword !== confirmNewPassword) throw new Error("Mật khẩu không khớp nhau.");
      if(newPassword.length < 6) throw new Error("Mật khẩu mới quá ngắn.");
      const accountData = await Account.findOne({ where: { userId } });
      if (!accountData) throw new Error("Cập nhật mật khẩu không thành công.");
      if(accountData.password !== oldPassword) throw new Error("Mật khẩu cũ chính xác đúng.");

      await Account.update({ password: newPassword }, { where: { userId } });

      return res.status(200).json({
        status: "success",
        message: "Cập nhật mật khẩu thành công.",
      })

    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
}

export default new UserController();
