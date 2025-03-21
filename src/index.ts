import express, { Application } from 'express';
import userRoutes from './routes/user.routes';
import carRoutes from './routes/car.routes';
import authRoutes from "./routes/auth.routes";
import dotenv from 'dotenv';
import {errorHandler} from "./middlewares/ErrorMiddleware";

require('express-async-errors');
dotenv.config({ path: '../.env' });

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes)

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(errorHandler);
export default app;