import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';

export class UserController {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }
  
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userRepository.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching users', 
        error: (error as Error).message 
      });
    }
  };

  getUserWithCars = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
  
      const userWithCars = await this.userRepository.findUserWithCars(id);
  
      if (!userWithCars) {
        res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(userWithCars);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: (error as Error).message,
      });
    }
  };
  
  
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userRepository.findById(id);
      
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user', 
        error: (error as Error).message 
      });
    }
  };
  
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user: User = req.body;
      
      // Validate input
      if (!user.name || !user.email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }
      
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        res.status(409).json({ message: 'User with this email already exists' });
        return;
      }
      
      const newUser = await this.userRepository.create(user);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating user', 
        error: (error as Error).message 
      });
    }
  };
  
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user: User = req.body;
      
      // Validate input
      if (!user.name || !user.email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }
      
      const updatedUser = await this.userRepository.update(id, user);
      
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating user', 
        error: (error as Error).message 
      });
    }
  };
  
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.userRepository.delete(id);
      
      res.status(200);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error deleting user', 
        error: (error as Error).message 
      });
    }
  };
}
