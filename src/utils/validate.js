class Validate {
  fullname(fullname) {
    ;
    try {
      if (!fullname || fullname.trim() === "") throw new Error("Vui lòng nhập fullname");
      if (fullname.length < 5 )
        throw new Error("fullname phải có độ dài tối thiểu 5 ký tự");
      if (fullname.length > 25) throw new Error("fullname có độ dài tối đa 25 ký tự");
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
    
    try {
      if (!username || username.trim() === "") throw new Error("Vui lòng nhập username");
      if(username.length > 25) throw new Error("username có độ dài tối đa 25 ký tự");
      if (username.length < 5)
        throw new Error("username phải có độ dài tối thiểu 5 ký tự");
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(username)) {
        throw new Error("username không được chứa ký tự đặc biệt");
      }
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
  email(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
      if (!email || email.trim() === "")
        throw new Error("Vui lòng nhập email");
      if (!emailRegex.test(email)) throw new Error("email không hợp lệ");
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
    ;
    try {
      if (!string || string.trim() === "") throw new Error("Vui lòng nhập password");
      if (string.length > 25)
        throw new Error("password có độ dài tối đa 25 ký tự");
      if (string.length < 6)
        throw new Error("password phải có tối thiểu 6 ký tự");
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
