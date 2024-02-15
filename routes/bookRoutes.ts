import express from 'express';

import {
  getAllBooks,
  createBook,
  getSingleBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getSingleBook);
router.post('/', createBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
