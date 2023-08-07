import { Router } from "express";
import AttendanceController from "../controllers/attendance/attendance.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJwt.js";

const router = Router();

router.patch('/attendance/clockIn', authenticateJWT, AttendanceController.clockIn);
router.patch('/attendance/clockOut', authenticateJWT, AttendanceController.clockOut);

export default router;