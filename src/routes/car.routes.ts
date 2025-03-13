import { Router } from 'express';
import { CarController } from '../controllers/car.controller';

const router = Router();
const carController = new CarController();

router.get('/', carController.getAllCars);
router.post('/', carController.createCar);

export default router;