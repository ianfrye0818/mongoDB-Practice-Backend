import Book from '../models/bookModel';
import { Request, Response } from 'express';

type BookType = {
  title: string;
  author: string;
  genre: string[];
  pages: number;
  reviews: { user: string; rating: number; comments: string }[];
  createdAt: string;
  updatedAt: NativeDate;
};

//get single book
async function getSingleBook(req: Request, res: Response) {
  try {
    const book = await Book.findById<BookType>(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//get all books
async function getAllBooks(req: Request, res: Response) {
  try {
    const books = await Book.find();
    if (!books) {
      return res.status(404).json({ message: 'No books found' });
    }

    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//create book
async function createBook(req: Request, res: Response) {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//update book
async function updateBook(req: Request, res: Response) {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    book = await Book.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

//delete book
async function deleteBook(req: Request, res: Response) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
}

export { getSingleBook, getAllBooks, createBook, updateBook, deleteBook };
