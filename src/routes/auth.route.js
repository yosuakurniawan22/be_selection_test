import { Router } from "express";
import AuthController from "../controllers/auth/auth.controller.js";
import { checkExpiredToken } from "../middlewares/checkExpiredToken.js";
import { authenticateJWT } from "../middlewares/authenticateJwt.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get('/auth/checkLinkExpired', AuthController.getLinkIsExpired);
router.post('/auth/login', AuthController.login);
router.post('/auth/createEmployee', authenticateJWT, isAdmin, AuthController.createEmployee);
router.put('/auth/updateAccount', checkExpiredToken, AuthController.updateAccount);

export default router;