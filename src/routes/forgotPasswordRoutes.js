import { Router } from "express";
import AuthController from "../controllers/authenticationController.js";
const router = Router();

router.post("/", AuthController.forgotPassword);

export default router;
