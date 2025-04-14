import jwt from "jsonwebtoken";
import { Account, User, sequelize } from "../model/index.js";
import decodeJWT from "../utils/decodeJWT.js";
import validate from "../utils/validate.js";
import nodemailer from "nodemailer";

class AuthenticationController {
  async register(req, res) {
    // const transaction = await sequelize.transaction();
    try {
      let { username, password, fullname, email } = req.body;

      // if(!username) throw new Error("Vui lòng điền usename")
      // if (!fullname) throw new Error("Vui lòng điền fulname");
      // if(!email) throw new Error("Vui lòng điền email");
      // if(!password) throw new Error("Vui lòng điền password");

      if (!validate.username(username).status)
        throw new Error(validate.username(username).message);
      if (!validate.fullname(fullname).status)
        throw new Error(validate.fullname(fullname).message);
      if (!validate.email(email).status)
        throw new Error(validate.email(email).message);
      if (!validate.password(password).status)
        throw new Error(validate.password(password).message);
      username = username?.trim()?.toLowerCase();
      email = email?.trim()?.toLowerCase();
      fullname = fullname?.trim();
      password = password?.trim();

      const user = await Account.findOne({
        where: { username },
      });

      if (user) {
        return res.status(409).json({
          status: "error",
          message: "username đã tồn tại vui lòng sử dụng username khác",
        });
      }
        // throw new Error("username đã tồn tại vui lòng sử dụng username khác");

      const result = await sequelize.transaction(async (t) => {
         const newUsers = await User.create(
           {
             fullname,
             email,
           },
           { transaction: t }
         );

         const newAccount = await Account.create(
           {
             username,
             userId: newUsers.id,
             password,
           },
           { transaction: t }
         );
      })
     

      // await transaction.commit();
      return res.status(201).json({
        status: "success",
        message: "Đăng ký tài khoản thành công",
      });
    } catch (error) {
      // console.log(error);
      // await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: error.message || "Tạo tài khoản thất bại",
      });
    }
  }
  async login(req, res) {
    try {
      let { username, password } = req.body;

      username = username?.trim()?.toLowerCase();
      password = password?.trim();
      // if(!validate.username(username).status) throw new Error(validate.username(username).message)
      // if(!validate.password(password).status) throw new Error(validate.password(password).message)
      if (!username) throw new Error("Vui lòng nhập tên đăng nhập");
      if (!password) throw new Error("Vui lòng nhập mật khẩu");
      const account = await Account.findOne({
        where: { username },
        include: User,
      });

      if (!account) throw new Error("Tài khoản không tồn tại");

      if (account.isLocked)
        throw new Error(
          "Tài khoản đã bị khóa không thể thực hiện chức năng này"
        );
      if (account.password !== password)
        throw new Error("Mật khẩu không chính xác");
      if (account.username !== username)
        throw new Error("Tên đăng nhập không chính xác");
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
        data: {
          access_token,
          refresh_token,
          user: {
            ...account.toJSON().User,
            username: account.toJSON().username,
          },
        },
      });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({
        status: "error",
        message: error.message || "Đăng nhập thất bại",
      });
    }
  }
  async refresh_token(req, res) {
    try {
      const refresh_token = req.body.refresh_token;
      if (!refresh_token) throw new Error("Yêu cầu refresh token");
      const decoded = decodeJWT(refresh_token);
      // console.log(decoded);

      if (!decoded.status) throw new Error(decoded.message);

      const account = await Account.findOne({
        where: { userId: decoded.data.userId },
      });
      // console.log(account);

      if (!account) throw new Error("Tài khoản không tồn tại");

      if (account.isLocked)
        throw new Error(
          "Tài khoản đã bị khóa không thể thực hiện chức năng này"
        );

      const dataEncoded = {
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
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log(email);

      if (!email) throw new Error("Vui lòng nhập email");
      if (!validate.email(email).status)
        throw new Error(validate.email(email).message);
      const userData = await User.findOne({
        where: { email },
      });
      if (!userData) throw new Error("Email không tồn tại");

      const accountData = await Account.findOne({
        where: { userId: userData.id },
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        // from: process.env.EMAIL_USERNAME,
        to: [userData.email],
        subject: "Cấp lại mật khẩu hệ thống quản lý công việc",
        // text: "Mật khẩu của bạn đã được cấp lại",
        html: `<p>Mật khẩu hiện tại của bạn là <strong>${accountData.password}</strong></p>`,
      };
      const data = await transporter.sendMail(mailOptions);
      // console.log(data);
      return res.status(200).json({
        status: "success",
        message: "Đã gửi mật khẩu tới email vui lòng truy cập email để xem.",
        // data: { token },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        status: "error",
        message: error.message || "Internal Server Error",
        data: null,
      });
    }
  }
}

export default new AuthenticationController();
