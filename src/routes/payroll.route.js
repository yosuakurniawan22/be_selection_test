import { Router } from "express";
import PayrollController from "../controllers/payroll/payroll.controller.js";
import { authenticateJWT } from "../middlewares/authenticateJwt.js";

const router = Router();

router.get('/payroll/reportMonthly', authenticateJWT, PayrollController.getPayrollReportMonthly);

export default router;