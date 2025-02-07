import { Router } from "express";
import feedbackController from "../controllers/feedbackController.js";
import authentication from "../middleware/authentication.js";

const router = Router();

router.get("/", authentication, feedbackController.getFeedback);
router.post("/", authentication, feedbackController.createOrUpdateFeedback);


export default router;
