import { Router } from "express";
import AuthController from "../controllers/auth/auth.controller.js";

const router = Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/createEmployee', AuthController.createEmployee);

export default router;