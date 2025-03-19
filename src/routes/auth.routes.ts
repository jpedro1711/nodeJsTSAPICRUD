import { Router } from 'express';
import {AuthController} from "../controllers/auth.controller";
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();
const authController = new AuthController();

router.post('/signup', authController.signUp);
router.post('/signin', authController.login);
router.get("/me", authenticateToken, authController.getProfile);
export default router;

