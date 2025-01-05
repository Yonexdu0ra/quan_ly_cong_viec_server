import jwt from "jsonwebtoken";
function decodeJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const isExpired = Date.now() >= decoded.exp * 1000;

    if (isExpired) {
      throw new Error("Token quá hạn");
    }

    return {
      status: true,
      data: decoded,
      message: "Token hợp lệ",
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      message: error.name || "Token không hợp lệ",
    };
  }
}

export default decodeJWT;
