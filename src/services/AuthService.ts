import {User} from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserRepository} from "../repositories/user.repository";
import {AppException} from "../Exceptions/AppException";
import {UserRole} from "../models/user.roles";
import {ExceptionMessage} from "../Resources/ExceptionMessages/ExceptionMessages";

export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async login(email: string, password: string): Promise<string> {
        const user: User | null = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppException(ExceptionMessage.NotFound, 404);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppException(ExceptionMessage.InvalidCredentials, 401); // Apenas lance
        }

        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
    }

    async register(email: string, password: string): Promise<boolean> {
        const userExists : User | null = await this.userRepository.findByEmail(email);

        if (userExists != null) {
            throw new AppException(ExceptionMessage.UserAlreadyExists, 400);
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const user: User = {
            name: email,
            password: hashedPassword,
            email: email,
            role: UserRole.USER,
        }

        const created: User = await this.userRepository.create(user);

        return !!created;
    }
}