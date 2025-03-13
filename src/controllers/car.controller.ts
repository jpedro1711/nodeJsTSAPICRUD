import { Car } from "../models/car.model";
import { CarRepository } from "../repositories/car.repository";
import { Request, Response } from 'express';
import { UserRepository } from "../repositories/user.repository";

export class CarController {
  private carRepository: CarRepository;
  private userRepository: UserRepository;

  constructor() {
   this.carRepository = new CarRepository(); 
   this.userRepository = new UserRepository();
  }

  getAllCars = async (req: Request, res: Response): Promise<void> => {
    try {
      const cars = await this.carRepository.findAll();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching users', 
        error: (error as Error).message 
      });
    }
  }

  createCar = async (req: Request, res: Response): Promise<void> => {
      try {
        const car: Car = req.body;
        
        if (!car.model || !car.brand) {
          res.status(400).json({ message: 'Model and brand are required' });
          return;
        }
        
        const existingUser = await this.userRepository.findById(car.user_id);
        if (!existingUser) {
          res.status(409).json({ message: 'Invalid owner id' });
          return;
        }
        
        const newCar = await this.carRepository.create(car);
        res.status(201).json(car);
      } catch (error) {
        res.status(500).json({ 
          message: 'Error creating car', 
          error: (error as Error).message 
        });
      }
    };
}