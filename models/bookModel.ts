import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: Array,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;
