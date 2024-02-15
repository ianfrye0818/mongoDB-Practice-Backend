import { Document } from 'mongoose';
import User, { UserType } from '../models/userModel';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../middleware/authMiddleware';

//get all users
export async function getAllUsers(req: Request, res: Response) {
  try {
    let users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Remove password field from each user object
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...others } = user.toObject();
      return others;
    });

    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//get a single user
export async function getSingleUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //extract password from user object
    const { password, ...others } = user.toObject();
    res.json(others);
  } catch (error) {
    console.log(error);
    res.json({ message: 'Something went wrong, please try again' });
  }
}

//create a user
export async function createUser(req: Request, res: Response) {
  try {
    const user = new User(req.body);
    await user.save();

    const { password, ...others } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json(others);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//update a user
export async function updateUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json('User not found');

  if (req.body.password) {
    const hashedPassword = await hashPassword(req.body.password);
    user.password = hashedPassword;
  }
  user.set(req.body);
  const updatedUser = await user.save();
  const { password, ...others } = updatedUser.toObject();
  res.json(others);
}

//delete a user
export async function deleteUser(req: Request, res: Response) {
  const user = (await User.findByIdAndDelete(req.params.id)) as Document<UserType>;
  if (!user) return res.status(404).json('User not found');
  res.json({ message: 'User deleted successfully' });
}

//login a user
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: pass, ...others } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });

    res.json(others);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//logout a user
export async function logoutUser(req: Request, res: Response) {
  res.cookie('auth_token', '', { maxAge: -1, httpOnly: true });
  res.cookie('refreshToken', '', { maxAge: -1, httpOnly: true });
  res.json({ message: 'User logged out successfully' });
}

//refresh token
export async function refreshToken(req: CustomRequest, res: Response) {
  try {
    const user = await User.findById(req.token.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}
