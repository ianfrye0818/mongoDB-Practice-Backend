import dotenv from 'dotenv';
dotenv.config();

//library imports
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
//custom imports
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';

//global variables
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//user routes
app.use('/api/users', userRoutes);

//book routes
app.use('/api/books', bookRoutes);

//set up mongoose
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server is running on port ${process.env.PORT} click here: http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => console.log(error.message));
