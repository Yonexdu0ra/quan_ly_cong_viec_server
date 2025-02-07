import { Router } from "express";
import userController from "../controllers/userController.js";
import authentication from "../middleware/authentication.js";
const router = Router();

router.get("/", authentication, userController.myInfo);
router.post("/change-password", authentication, userController.changePassword);


export default router;
