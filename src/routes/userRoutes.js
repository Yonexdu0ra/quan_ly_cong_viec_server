import { Router } from "express";
import userController from "../controllers/userController.js";
import authentication from "../middleware/authentication.js";
const router = Router();

router.get("/", authentication, userController.myInfo);


export default router;
