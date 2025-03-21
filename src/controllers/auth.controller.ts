import {UserRepository} from "../repositories/user.repository";
import {NextFunction, Request, Response} from 'express';
import {AuthRequest} from "../middlewares/authMiddleware";
import {AppException} from "../Exceptions/AppException";
import {AuthService} from "../services/AuthService";
import {LoginOrRegistrationRequest} from "../models/Requests/LoginOrRegistrationRequest";
import {ExceptionMessage} from "../Resources/ExceptionMessages/ExceptionMessages";
import {ResponseMessage} from "../Resources/SucessMessages/ResponseMessage";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService(new UserRepository());
    }

    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const request = new LoginOrRegistrationRequest(req.body.email, req.body.password);

        if (!request.validate()) {
            next(new AppException(ExceptionMessage.AuthValidationError, 400));
        }

        try {
            await this.authService.register(request.email, request.password);

            res.status(201).json({ message: ResponseMessage.CreatedSuccesfully, success: true });
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const request = new LoginOrRegistrationRequest(req.body.email, req.body.password);

        if (!request.validate()) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        try {
            const token: string = await this.authService.login(request.email, request.password);

            res.status(200).json({
                message: 'Login successful',
                success: true,
                token: token
            });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        res.status(200).json({ user: req.user, success: true });
    };

}