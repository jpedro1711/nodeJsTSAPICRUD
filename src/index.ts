import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config';
import userRoutes from './routes/user.routes';
import carRoutes from './routes/car.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;