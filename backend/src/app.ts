import express from 'express';
import dotenv from 'dotenv';
import restaurantsRouter from './routes/restaurants';
import authRoutes from './routes/auth'; 
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/auth', authRoutes); 
app.use('/api/restaurants', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment-methods', paymentMethodRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
