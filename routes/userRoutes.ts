import express from 'express';
import {
  getAllUsers,
  createUser,
  getSingleUser,
  loginUser,
  deleteUser,
  updateUser,
  logoutUser,
  refreshToken,
} from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/logout', logoutUser);
router.post('/refresh', verifyToken, refreshToken as any);

export default router;
