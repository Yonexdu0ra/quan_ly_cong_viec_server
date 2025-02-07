import { Router } from "express";
import JobController from "../controllers/jobControllers.js";
import authentication from "../middleware/authentication.js";

const router = Router();

router.get("/", authentication, JobController.searchJob);
router.get("/sort", authentication, JobController.sortJob);
router.post("/", authentication, JobController.createJob);
router.get("/:id", authentication, JobController.getJobById);
router.put("/:id", authentication, JobController.updateJob);
router.delete("/:id", authentication, JobController.deleteJob);

export default router;
