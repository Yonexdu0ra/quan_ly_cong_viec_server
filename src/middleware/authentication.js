import decodeJWT from "../utils/decodeJWT.js";
const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error("Unauthorized");

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) throw new Error("Unauthorized");
    const decoded = decodeJWT(access_token);
    // console.log(decoded, access_token);
    
    if (!decoded.status) throw new Error(decoded.message);
    req.userId = decoded.data.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ status: "error", message: error.message || "Unauthorized" });
  }
};

export default authentication;
