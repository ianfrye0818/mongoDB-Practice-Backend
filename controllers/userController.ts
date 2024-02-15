import { Document } from 'mongoose';
import User, { UserType } from '../models/userModel';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/bcrypt';

//get all users
export async function getAllUsers(req: Request, res: Response) {
  try {
    let users = await User.find();
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    //extract password from user object
    users.forEach((user) => {
      const { password, ...others } = user.toObject();
      return others;
    });
    res.json(users);
  } catch (error) {
    console.log(error);
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
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (isPasswordCorrect) {
      const { password, ...others } = user.toObject();
      res.json(others);
    } else {
      res.status(401).json('Incorrect Password');
    }
  } else {
    res.send('Invalid credentials');
  }
};
