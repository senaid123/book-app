import express from "express";
import {
  addAuthorToBook,
  createBook,
  deleteBook,
  getAtuhorsForBooks,
  getBookById,
  getBooks,
  removeAuthorFromBook,
  updateBook,
  validateBookForm,
} from "../controllers/book.js";
import { validateAuthorForm } from "../controllers/author.js";

const router = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get("/books", getBooks);

/**
 * @swagger
 *  /books:
 *    post:
 *      summary: Create new book
 *      tags: [Books]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *      responses:
 *       201:
 *         description: Book successfully created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 */
router.post("/books", validateBookForm, createBook);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: Book data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/books/:id", getBookById);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update an existing book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book successfully updated
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put("/books/:id", updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove existing book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book successfully deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/books/:id", deleteBook);

/**
 * @swagger
 * /books/{id}/authors:
 *   get:
 *     summary: Retrieve a list of authors for a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of authors for the book
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
 *                     description: The UUID of the author
 *                   name:
 *                     type: string
 *                     description: The name of the author
 *                   biography:
 *                     type: string
 *                     description: A short biography of the author
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/books/:id/authors", getAtuhorsForBooks);

/**
 * @swagger
 * /books/{id}/authors:
 *   post:
 *     summary: Add an author to a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the author
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the author
 *                 example: "Doe"
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the author
 *                 example: "1980-05-12"
 *               image:
 *                 type: string
 *                 description: URL of the author's image
 *                 example: "https://example.com/author-photo.jpg"
 *     responses:
 *       200:
 *         description: Author added to the book successfully
 *       400:
 *         description: Author is already added to the book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.post("/books/:id/authors", validateAuthorForm, addAuthorToBook);

/**
 * @swagger
 * /books/{idBook}/authors/{idAuthor}:
 *   delete:
 *     summary: Remove an author from a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: idBook
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idAuthor
 *         required: true
 *         description: UUID of the author to be removed
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Author removed from the book successfully
 *       400:
 *         description: Book is not related to this author
 *       404:
 *         description: Book or Author not found
 *       500:
 *         description: Internal server error
 */
router.delete("/books/:idBook/authors/:idAuthor", removeAuthorFromBook);

export { router as bookRouter };
