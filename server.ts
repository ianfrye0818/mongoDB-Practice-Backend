import dotenv from 'dotenv';
dotenv.config();

//library imports
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
//custom imports
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';

//global variables
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;
console.log(MONGO_URI);

//middleware
app.use(express.json());
app.use(cookieParser());

//user routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

//book routes
// ...

//set up mongoose
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT || 3000, () => {
      console.log(`Server is running on port ${PORT} click here: http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error.message));
