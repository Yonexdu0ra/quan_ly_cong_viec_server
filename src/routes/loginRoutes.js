import { Router } from "express";
import AuthController from "../controllers/authenticationController.js";
const router = Router();

router.post("/", AuthController.login);

export default router;
