import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../src/app.js";
import models from "../../src/models/index.js";

describe("GET /books", () => {
  it("should return a list of books", async () => {
    const response = await request(app).get("/books");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("POST /books", () => {
  it("should create a new book", async () => {
    const bookData = {
      isbn: "SK123123",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    };

    const response = await request(app)
      .post("/books")
      .send(bookData)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);

    const createdBook = await models.Book.findOne({
      where: { isbn: "SK123123" },
    });

    expect(createdBook).not.toBeNull();
    expect(createdBook.isbn).toBe(bookData.isbn);
    expect(createdBook.title).toBe(bookData.title);
    expect(createdBook.pages).toBe(bookData.pages);
    expect(createdBook.published).toBe(bookData.published);
    expect(createdBook.image).toBe(bookData.image);
  });

  it("should return an error if required fields are missing", async () => {
    const invalidBookData = {
      isbn: "SOAOPSA",
      title: "Book Title",
      image: "https://example.com/images/mark-twain.jpg",
    };

    const response = await request(app)
      .post("/authors")
      .send(invalidBookData)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBeInstanceOf(Array);
  });
});

describe("GET /books/:id", () => {
  it("should return book by id", async () => {
    const createdBook = await models.Book.create({
      isbn: "SK1231KK23",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const id = createdBook.id;

    const response = await request(app).get(`/books/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.book).toBeDefined();
    expect(response.body.book.isbn).toBe(createdBook.isbn);
    expect(response.body.book.title).toBe(createdBook.title);
    expect(response.body.book.published).toBe(createdBook.published);
    expect(response.body.book.pages).toBe(createdBook.pages);
  });

  it("should return 404 if book is not found", async () => {
    const response = await request(app).get("/books/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });
});

describe("PUT /books/:id", () => {
  it("should update a book", async () => {
    const createdBook = await models.Book.create({
      isbn: "SK1231KKS23",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const id = createdBook.id;

    const response = await request(app)
      .put(`/books/${id}`)
      .send({
        title: "NEW BOOK NAME",
        published: 2023,
        pages: 222,
        isbn: "SKSAAAACCCCVV",
        image: "https://new-image.png",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book successfully updated");
  });

  it("should return 404 if book is not found", async () => {
    const response = await request(app)
      .put(`/books/2141234`)
      .send({ title: "NEW BOOK TITLE" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });
});

describe("DELETE /books/:id", () => {
  it("should delete a book", async () => {
    const createdBook = await models.Book.create({
      isbn: "SK1231KKS233",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const id = createdBook.id;

    const response = await request(app).delete(`/books/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book successfully deleted");
  });

  it("should return 404 if book is not found", async () => {
    const response = await request(app).delete(`/books/2141234`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });
});

describe("GET /books/:id/authors", () => {
  it("should return all authors from required book", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "SK1216123233123",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdBook.addAuthor(createdAuthor);

    const response = await request(app).get(`/books/${createdBook.id}/authors`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should return 404 if author not found", async () => {
    const response = await request(app).get(`/books/1239128/authors`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });
});

describe("POST /books/:id/authors", () => {
  it("should add new author to the book ", async () => {
    const createdBook = await models.Book.create({
      isbn: "SK1AD12213213",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const response = await request(app)
      .post(`/books/${createdBook.id}/authors`)
      .send({
        firstName: "Branko",
        lastName: "Copic",
        dob: new Date("1835-11-30"),
        image: "https://example.com/images/branko.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Author added to the book successfully");
  });

  it("should return 404 if book not found", async () => {
    const response = await request(app)
      .post(`/books/123123/authors`)
      .send({
        firstName: "Branko",
        lastName: "Copic",
        dob: new Date("1835-11-30"),
        image: "https://example.com/images/branko.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });

  it("should create new author if does not exists", async () => {
    const createdBook = await models.Book.create({
      isbn: "SK12312AA213213",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const response = await request(app)
      .post(`/books/${createdBook.id}/authors`)
      .send({
        firstName: "J.K",
        lastName: "Rowling",
        dob: new Date("1835-11-30"),
        image: "https://example.com/images/mark-twain.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Author added to the book successfully");
  });

  it("should return message author already added", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Branko",
      lastName: "Copic",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "ASDUIOPC2324",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdBook.addAuthor(createdAuthor);

    const response = await request(app)
      .post(`/books/${createdBook.id}/authors`)
      .send({
        id: uuidv4(),
        firstName: "Branko",
        lastName: "Copic",
        dob: new Date("1835-11-30"),
        image: "https://example.com/images/mark-twain.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Author is already added to the book");
  });
});

describe("DELETE /books/:idBook/authors/:idBook", () => {
  it("should delete selected author from book", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Agatha",
      lastName: "Christie",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "YXCVBNMMS",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdBook.addAuthor(createdAuthor);

    const response = await request(app).delete(
      `/books/${createdBook.id}/authors/${createdAuthor.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Author removed from the book successfully",
    );
  });

  it("shoud return 404 if no book", async () => {
    const response = await request(app).delete(`/books/12312/authors/435345`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });

  it("shoud return 404 if no author", async () => {
    const createdBook = await models.Book.create({
      isbn: "MFDSASDADASAYAXC",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const response = await request(app).delete(
      `/books/${createdBook.id}/authors/435345`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });

  it("shoud return that books is not realted to author", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Abdulah",
      lastName: "Sidran",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "MFDSASDSAAYXSS",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const response = await request(app).delete(
      `/books/${createdBook.id}/authors/${createdAuthor.id}`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book is not related with this author");
  });
});
