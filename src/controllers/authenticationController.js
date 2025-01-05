import jwt from "jsonwebtoken";
import { Account, User, sequelize } from "../model/index.js";
import decodeJWT from "../utils/decodeJWT.js";
class AuthenticationController {
  async register(req, res) {
    const transaction = await sequelize.transaction();
    try {
      let { username, password, fullname, email } = req.body;

      if (!username) throw new Error("Vui lòng điền username");
      if (!password) throw new Error("Vui lòng điền password");
      if (!fullname) throw new Error("Vui lòng điền fullname");
      if (!email) throw new Error("Vui lòng điền email");
      if (password.length < 6)
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      if (username.length < 5)
        throw new Error("Tên đăng nhập phải có ít nhất 5 ký tự");
      if (fullname.length < 5)
        throw new Error("Tên đầy đủ phải có ít nhất 5 ký tự");
      const isEmail = /\S+@\S+\.\S+/;
      if (!isEmail.test(email)) throw new Error("Email không hợp lệ");

      username = username?.trim()?.toLowerCase();

      const user = await Account.findOne({
        where: { username },
      });

      if (user) throw new Error("Tài khoản đã tồn tại");

      const newUsers = await User.create({
        fullname,
        email,
      }, {
        raw: true
      });

      // console.log(newUsers.toJSON());

      const newAccount = await Account.create({
        username,
        userId: newUsers.id,
        password,
      });
      // console.log(newAccount.toJSON());
      await transaction.commit();
      return res.status(201).json({
        status: "success",
        message: "Tạo tài khoản thành công",
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: error.message || "Tạo tài khoản thất bại",
      });
    }
  }
  async login(req, res) {
    try {
      let { username, password } = req.body;
      if (!username)
        return res
          .status(400)
          .json({ status: "error", message: "Vui lòng điền username" });
      if (!password)
        return res
          .status(400)
          .json({ status: "error", message: "Vui lòng điền password" });
      username = username?.trim()?.toLowerCase();
      password = password?.trim();

      const account = await Account.findOne({
        where: { username },
        include: User,
      });

      if (!account)
        return res
          .status(404)
          .json({ status: "error", message: "Tài khoản không tồn tại" });
      if (account.isLocked)
        return res
          .status(403)
          .json({ status: "error", message: "Tài khoản đã bị khóa" });
      if (account.password !== password)
        return res
          .status(401)
          .json({ status: "error", message: "Mật khẩu không chính xác" });
      if (account.username === username) {
        const dataEncoded = {
          userId: account.userId,
        };
        const access_token = jwt.sign(dataEncoded, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        const refresh_token = jwt.sign(dataEncoded, process.env.SECRET_KEY, {
          expiresIn: "3d",
        });
        return res.status(200).json({
          status: "success",
          message: "Đăng nhập thành công",
          data: { access_token, refresh_token, user: account.User },
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ status: "error", message: "Không thể xác thực tài khoản" });
    }
  }
  async refresh_token(req, res) {
    try {
      const refresh_token = req.body.refresh_token;
      if (!refresh_token) throw new Error("Yêu cầu refresh token");
      const decoded = decodeJWT(refresh_token);
      if (!decoded.status) throw new Error(decoded.message);

      const account = await Account.findOne({
        where: { username: decoded.data.username },
      });
      if (!account) throw new Error("Tài khoản không tồn tại");

      if (account.isLocked)
        throw new Error(
          "Tài khoản đã bị khóa không thể thực hiện chức năng này"
        );

      const dataEncoded = {
        username: account.username,
        role: account.role,
        userId: account.userId,
      };
      const access_token = jwt.sign(dataEncoded, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        status: "success",
        message: "Lấy access token thành công",
        data: { access_token },
      });
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: error.message || "Unauthorized",
        data: null,
      });
    }
  }
}

export default new AuthenticationController();
