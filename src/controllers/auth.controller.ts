import {UserRepository} from "../repositories/user.repository";
import { Request, Response } from 'express';
import {User} from "../models/user.model";
import bcrypt from 'bcrypt';
import {UserRole} from "../models/user.roles";
import jwt from 'jsonwebtoken';

export class AuthController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    signUp = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'userName and password are required' });
            return;
        }

        const userExists : User | null = await this.userRepository.findByEmail(email);

        if (userExists != null) {
            res.status(400).json({ message: 'user already exists with this e-mail address' });
            return;
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const user: User = {
            name: email,
            password: hashedPassword,
            email: email,
            role: UserRole.USER,
        }

        const created: User = await this.userRepository.create(user);

        res.status(201).json({ message: `created user with username ${created.email}` });
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user: User | null = await this.userRepository.findByEmail(email);

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });
    };
}