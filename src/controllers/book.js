import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { body, validationResult } from "express-validator";
import { logger } from "../helpers/logger.js";
import models from "../models/index.js";

export const validateBookForm = [
  body("isbn").notEmpty().withMessage("ISBN is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("pages").notEmpty().withMessage("Pages is required"),
  body("published").notEmpty().withMessage("Published is required"),
  body("image").notEmpty().withMessage("Image is required"),
];

export const getBooks = async (req, res) => {
  try {
    const books = await models.Book.findAll({ raw: true });
    res.status(200).send({ books });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createBook = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { isbn, title, pages, published, image } = req.body;

  try {
    const book = await models.Book.findOne({
      where: { isbn: isbn },
    });

    if (book) {
      return res.status(400).send({ message: "ISBN Already exists" });
    }

    await models.Book.create({
      isbn,
      title,
      pages,
      published,
      image,
    });

    res.status(201).send({ message: "Book Sucessfully Created" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getBookById = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await models.Book.findByPk(id);

    if (book) {
      res.status(200).send({ book });
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateBook = async (req, res) => {
  const id = req.params.id;

  const { isbn, title, pages, published, image } = req.body;

  try {
    const book = await models.Book.findByPk(id);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    const updatedFields = {};

    if (isbn) updatedFields.isbn = isbn;
    if (title) updatedFields.title = title;
    if (pages) updatedFields.pages = pages;
    if (published) updatedFields.published = published;
    if (image) updatedFields.image = image;

    const [updated] = await models.Book.update(updatedFields, {
      where: { id },
    });

    if (!updated) {
      return res.status(400).send({ message: "Update failed" });
    }

    res.status(200).send({ message: "Book successfully updated" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await models.Book.findByPk(id);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    await models.Book.destroy({
      where: { id },
    });

    return res.status(200).send({ message: "Book successfully deleted" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getAtuhorsForBooks = async (req, res) => {
  const id = req.params.id;

  try {
    const book = await models.Book.findByPk(id, {
      include: [{ model: models.Author, as: "authors" }],
    });

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.status(200).send(book.authors);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal erver error" });
  }
};

export const addAuthorToBook = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const id = req.params.id;
  const { firstName, lastName, dob, image } = req.body;

  try {
    const book = await models.Book.findByPk(id);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    const cmprDate = new Date(dob);

    const author = await models.Author.findOne({
      where: {
        firstName: { [Op.eq]: firstName },
        lastName: { [Op.eq]: lastName },
        dob: cmprDate,
      },
    });

    if (!author) {
      const newAuthor = await models.Author.create({
        id: uuidv4(),
        firstName,
        lastName,
        dob,
        image,
      });

      await book.addAuthor(newAuthor);

      return res
        .status(200)
        .send({ message: "Author added to the book successfully" });
    }

    const hasAuthor = await book.hasAuthor(author);

    if (hasAuthor) {
      return res
        .status(400)
        .send({ message: "Author is already added to the book" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

export const removeAuthorFromBook = async (req, res) => {
  const { idBook, idAuthor } = req.params;

  try {
    const book = await models.Book.findByPk(idBook);
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    const author = await models.Author.findByPk(idAuthor);

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const hasBook = await book.hasAuthor(author);
    if (!hasBook) {
      return res
        .status(400)
        .send({ message: "Book is not related with this author" });
    }

    await book.removeAuthor(author);

    res
      .status(200)
      .send({ message: "Author removed from the book successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
