import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import models from "../models/index.js";
import { logger } from "../helpers/logger.js";

export const validateAuthorForm = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("dob").isISO8601().withMessage("Invalid date for dob"),
  body("image").notEmpty().withMessage("Image is required"),
];

export const getAuthors = async (req, res) => {
  try {
    const authors = await models.Author.findAll({ raw: true });
    res.status(200).send({ authors });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const createAuthor = async (req, res) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(400).send({ error: erros.array() });
  }

  const { firstName, lastName, dob, image } = req.body;

  const cmprDate = new Date(dob);
  try {
    const author = await models.Author.findOne({
      raw: true,
      where: {
        firstName: { [Op.eq]: firstName },
        lastName: { [Op.eq]: lastName },
        dob: cmprDate,
      },
    });

    if (author) {
      return res.status(400).send({ message: "Author already exists" });
    }

    await models.Author.create({
      id: uuidv4(),
      firstName,
      lastName,
      dob,
      image,
    });

    res.status(201).send({ message: "Author successfully created" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getAuthorById = async (req, res) => {
  const id = req.params.id;

  try {
    const author = await models.Author.findByPk(id);

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res.status(200).send({ author });
  } catch (error) {
    logger.error(error);
    res.status(500).send({error: "Internal server error"});
  }
};

export const updateAuthor = async (req, res) => {
  const id = req.params.id;

  try {
    const author = await models.Author.findByPk(id);

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const { firstName, lastName, dob, image } = req.body;

    const updatedFields = {};
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (dob) updatedFields.dob = dob;
    if (image) updatedFields.image = image;

    const [updated] = await models.Author.update(updatedFields, {
      where: { id },
    });

    if (!updated) {
      return res.status(400).send({ message: "Author update failed" });
    }

    res.status(200).send({ message: "Author successfully updated" });
  } catch (error) {
    res.status(500).send({error: "Internal server error"});
  }
};

export const deleteAuthor = async (req, res) => {
  const id = req.params.id;
  try {
    const author = await models.Author.findByPk(id);

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    await models.Author.destroy({
      where: { id },
    });

    return res.status(200).send({ message: "Author successfully deleted" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({error: "Internal server error"});
  }
};

export const getBooksForAuthor = async (req, res) => {
  const idAuthor = req.params.idAuthor;

  try {
    const author = await models.Author.findByPk(idAuthor, {
      include: [{ model: models.Book, as: "books" }],
    });

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    res.status(200).send(author.books);
  } catch (error) {
    logger.error(error);
    res.status(500).send({error: "Internal server error" });
  }
};

export const addBookToAuthor = async (req, res) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(400).send({ error: erros.array() });
  }
  const idAuthor = req.params.idAuthor;
  const { isbn, title, pages, published, image } = req.body;

  try {
    const author = await models.Author.findByPk(idAuthor);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const book = await models.Book.findOne({
      where: {
        isbn,
      },
    });

    if (!book) {
      const newBook = await models.Book.create({
        isbn,
        title,
        pages,
        published,
        image,
      });

      await author.addBook(newBook);

      return res
        .status(200)
        .send({ message: "Book added to the author successfully" });
    }

    const hasBook = await author.hasBook(book);

    if (hasBook) {
      return res
        .status(400)
        .send({ message: "Book is already added to the author" });
    }

  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const removeBookFromAuthor = async (req, res) => {
  const { idAuthor, idBook } = req.params;

  try {
    const author = await models.Author.findByPk(idAuthor);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const book = await models.Book.findByPk(idBook);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    const hasAuthor = await author.hasBook(book);

    if (!hasAuthor) {
      return res
        .status(400)
        .send({ message: "Author is not related with this book" });
    }

    await author.removeBook(book);

    res
      .status(200)
      .send({ message: "Book removed from the author successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
