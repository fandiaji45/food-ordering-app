import express from 'express';
import { register, login  } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);  // jangan pake register()
router.post('/login', login);

export default router;
