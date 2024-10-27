import express from "express";
import {
  addAuthorBook,
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthors,
  getAuthorBooks,
  removeAuthorBook,
  updateAuthor,
  validateAuthorForm,
} from "../controllers/author.js";
import { validateBookForm } from "../controllers/book.js";

const router = express.Router();

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve a list of authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *       500:
 *         description: Internal server error
 */
router.get("/authors", getAuthors);

/**
 * @swagger
 *  /authors:
 *    post:
 *      summary: Create new author
 *      tags: [Authors]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *      responses:
 *       201:
 *         description: Author successfully created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 */
router.post("/authors", validateAuthorForm, createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the author
 *     responses:
 *       200:
 *         description: Author data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.get("/authors/:id", getAuthorById);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author successfully updated
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.put("/authors/:id", updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Remove existing author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the author
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author successfully deleted
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.delete("/authors/:id", deleteAuthor);

/**
 * @swagger
 * /authors/{idAuthor}/books:
 *   get:
 *     summary: Retrieve a list of books for a specific author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A list of books for the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The UUID of the book
 *                   title:
 *                     type: string
 *                     description: The title of the book
 *                   publishedYear:
 *                     type: integer
 *                     description: The year the book was published
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.get("/authors/:idAuthor/books", getAuthorBooks);

/**
 * @swagger
 * /authors/{idAuthor}/books:
 *   post:
 *     summary: Add a new book to a specific author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *                 description: ISBN of the book
 *                 example: "978-3-16-148410-0"
 *               title:
 *                 type: string
 *                 description: Title of the book
 *                 example: "Sample Book Title"
 *               pages:
 *                 type: integer
 *                 description: Total number of pages in the book
 *                 example: 300
 *               published:
 *                 type: integer
 *                 format: date
 *                 description: Publication date of the book
 *                 example: 2023
 *               image:
 *                 type: string
 *                 description: URL of the book cover image
 *                 example: "https://example.com/book-cover.jpg"
 *     responses:
 *       200:
 *         description: Book added to the author successfully
 *       400:
 *         description: Book is already added to the author
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.post("/authors/:idAuthor/books", validateBookForm, addAuthorBook);

/**
 * @swagger
 * /authors/{idAuthor}/books/{idBook}:
 *   delete:
 *     summary: Remove a book from a specific author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: ID of the author
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: idBook
 *         required: true
 *         description: ID of the book to be removed
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book removed from the author successfully
 *       400:
 *         description: Author is not related to this book
 *       404:
 *         description: Author or Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/authors/:idAuthor/books/:idBook", removeAuthorBook);

export { router as authorRouter };
