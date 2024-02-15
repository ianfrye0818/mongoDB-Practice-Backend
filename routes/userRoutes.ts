import express from 'express';
import {
  getAllUsers,
  createUser,
  getSingleUser,
  loginUser,
  deleteUser,
  updateUser,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
