import { Router } from 'express';
import userController from '../controllers/users.controller.js';

const router = Router();

router.get('/:userId', userController.getUserById);
router.post('/register', userController.register);
router.post('/login', userController.authenticateUser);

export default router;
