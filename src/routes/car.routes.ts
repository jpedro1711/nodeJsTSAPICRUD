import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import {authenticateToken} from "../middlewares/authMiddleware";

const router = Router();
const carController = new CarController();

router.get('/', authenticateToken, carController.getAllCars);
router.post('/', carController.createCar);

export default router;