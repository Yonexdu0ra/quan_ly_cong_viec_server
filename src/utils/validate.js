class Validate {
  fullname(fullname) {
    fullname = fullname.trim();
    try {
      if (fullname === "") throw new Error("Họ và tên không được để trống");
      if (fullname.length < 5 || fullname.length > 25)
        throw new Error("Họ và tên phải từ 5 đến 25 ký tự");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  username(username) {
    username = username.trim();
    try {
      if (username === "") throw new Error("Tên đăng nhập không được để trống");
      if (username.length < 5 || username.length > 25)
        throw new Error("Tên đăng nhập phải từ 5 đến 25 ký tự");
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(username)) {
        throw new Error("Tài khoản không được chứa ký tự đặc biệt");
      }
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || "Tên đăng nhập không hợp lệ",
      };
    }
  }
  email(email) {
    email = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (email === "") throw new Error("Email không được để trống");
      if (!emailRegex.test(email)) throw new Error("Email không hợp lệ");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  password(string) {
    string = string.trim();
    try {
      if (string === "") throw new Error("Mật khẩu không được để trống");
      if (string.length < 6 || string.length > 25)
        throw new Error("Mật khẩu phải từ 6 đến 25 ký tự");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  phone(phone) {
    phone = phone.trim();
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    try {
      if (phone === "") throw new Error("Số điện thoại không được để trống");
      if (!phoneRegex.test(phone))
        throw new Error("Số điện thoại không hợp lệ");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  description(description) {
    description = description.trim();
    try {
      //   if (description === "") throw new Error("Mô tả không được để trống");
      if (description.length > 500)
        throw new Error("Mô tả không được quá 500 ký tự");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  rate(rate) {
    try {
      if (rate < 1 || rate > 5) throw new Error("Đánh giá phải từ 1 đến 5 sao");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  content(content) {
    content = content.trim();
    try {
      if (content === "") throw new Error("Nội dung không được để trống");
      if (content.length > 500)
        throw new Error("Nội dung không được quá 500 ký tự");
      return {
        status: true,
        message: "",
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}

export default new Validate();
