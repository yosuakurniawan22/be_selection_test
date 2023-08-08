import { Router } from "express";
import AttendanceController from "../controllers/attendance/attendance.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJwt.js";

const router = Router();

router.get('/attendance/:date', authenticateJWT, AttendanceController.getAttendanceByDate);
router.get('/attendance/history', authenticateJWT, AttendanceController.getAttendanceHistory);
router.patch('/attendance/clockIn', authenticateJWT, AttendanceController.clockIn);
router.patch('/attendance/clockOut', authenticateJWT, AttendanceController.clockOut);

export default router;