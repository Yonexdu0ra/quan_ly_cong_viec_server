import { Router } from "express";
import scheduleController from "../controllers/scheduleController.js";
import authentication from "../middleware/authentication.js";

const router = Router();

router.get("/", authentication, scheduleController.searchSchedule);
router.post("/", authentication, scheduleController.createSchedule);
router.put("/:id", authentication, scheduleController.updateSchedule);
router.delete("/:id", authentication, scheduleController.deleteSchedule);
router.get("/sort", authentication, scheduleController.sortSchedule);

export default router;
