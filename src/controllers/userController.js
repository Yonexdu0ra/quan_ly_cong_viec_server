import { Account, sequelize, User } from "../model/index.js";

class UserController {
  async myInfo(req, res) {
    try {
      const userId = req.userId;
      if (!userId) throw new Error("Nguoi dung khong ton tai.");
      const userData = await Account.findOne({
        include: User,
      });

      return res.status(200).json({
        status: "success",
        data: {
          // id: userData.id,
          ...userData.User.dataValues,
          username: userData.username,
        },
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
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword.length < 6)
        throw new Error("Mật khẩu mới tối thiểu phải hơn 6 ký tự.");
      if (newPassword !== confirmPassword)
        throw new Error("Mật khẩu không khớp nhau.");
      const accountData = await Account.findOne({ where: { userId } });
      if (!accountData) throw new Error("Cập nhật mật khẩu không thành công.");
      if (accountData.password !== currentPassword)
        throw new Error("Mật khẩu cũ không đúng.");

      await Account.update({ password: newPassword }, { where: { userId } });

      return res.status(200).json({
        status: "success",
        message: "Cập nhật mật khẩu thành công.",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async updateInfo(req, res) {
    
    try {
      const userId = req.userId;
      const { fullname, phone, description } = req.body;
      if (!fullname) throw new Error("Tên không được để trống.");
      if (!phone) throw new Error("Số điện thoại không được để trống.");
      if (!description) throw new Error("Số điện thoại không hợp lệ.");
      if (description.length > 500)
        throw new Error("tiểu sử không được quá 500 ký tự.");
      if (fullname.length > 25) throw new Error("Tên không được quá 25 ký tự.");
      if (phone.length > 10)
        throw new Error("Số điện thoại không được quá 10 ký tự.");

      const [, isUpdate] = await User.update(
        {
          fullname,
          phone,
          description,
        },
        { where: { id: userId }, returning: true }
      );
     if(!isUpdate) throw new Error("Cập nhật thông tin không thành công.");
      const newData = await User.findByPk(userId);
      return res.status(200).json({
        status: "success",
        message: "Cập nhật thông tin thành công.",
        data: newData,
      });
    } catch (error) {
      
      return res
        .status(500)
        .json({ status: "error", message: error.message || "Lỗi" });
    }
  }
  async checkUsername(req, res) {
    try {
      const { username } = req.query;
      const accountData = await Account.findOne({
        where: { username },
        attributes: ["id", "username"],
      });
      if (accountData)
        throw new Error(
          "tài khoản này đã tồn tại vui lòng chọn tài khoản khác."
        );
      return res.status(200).json({
        status: "success",
        message: "tài khoản này có thể sử dụng.",
      });
    } catch (error) {
      return res.status(200).json({
        status: "error",
        message:
          error.message ||
          "tài khoản này đã tồn tại vui lòng chọn tài khoản khác.",
      });
    }
  }
}

export default new UserController();
