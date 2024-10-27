import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../src/app.js";
import models from "../../src/models/index.js";

describe("GET /authors", () => {
  it("should return a list of authors", async () => {
    const response = await request(app).get("/authors");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("POST /authors", () => {
  it("should create a new author", async () => {
    const authorData = {
      firstName: "Steven",
      lastName: "King",
      dob: new Date("1775-12-16"),
      image: "https://example.com/images/jane-austen.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await request(app)
      .post("/authors")
      .send(authorData)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);

    const createdAuthor = await models.Author.findOne({
      where: { firstName: "Steven", lastName: "King" },
    });

    expect(createdAuthor).not.toBeNull();
    expect(createdAuthor.firstName).toBe(authorData.firstName);
    expect(createdAuthor.lastName).toBe(authorData.lastName);
    expect(createdAuthor.dob.toISOString()).toBe(authorData.dob.toISOString());
    expect(createdAuthor.image).toBe(authorData.image);
  });

  it("should return an error if required fields are missing", async () => {
    const invalidAuthorData = {
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    };

    const response = await request(app)
      .post("/authors")
      .send(invalidAuthorData)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBeInstanceOf(Array);
  });
});

describe("GET /authors/:id", () => {
  it("should return author by id", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const id = createdAuthor.id;

    const response = await request(app).get(`/authors/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.author).toBeDefined();
    expect(response.body.author.firstName).toBe("Mark");
  });

  it("should return 404 if author is not found", async () => {
    const response = await request(app).get("/authors/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });
});

describe("PUT /authors/:id", () => {
  it("should update an author", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const id = createdAuthor.id;

    const response = await request(app)
      .put(`/authors/${id}`)
      .send({ firstName: "Nicolas", lastName: "Cage" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Author successfully updated");
  });

  it("should return 404 if author is not found", async () => {
    const response = await request(app)
      .put(`/authors/2141234`)
      .send({ firstName: "Nicolas" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });
});

describe("DELETE /authors/:id", () => {
  it("should delete an author", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const id = createdAuthor.id;

    const response = await request(app).delete(`/authors/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Author successfully deleted");
  });

  it("should return 404 if author is not found", async () => {
    const response = await request(app).delete(`/authors/2141234`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });
});

describe("GET /authors/:idAuthor/books", () => {
  it("should return all books from required author", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Ivo",
      lastName: "Andric",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "SK123234123",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdAuthor.addBook(createdBook);

    const response = await request(app).get(
      `/authors/${createdAuthor.id}/books`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should return 404 if author not found", async () => {
    const response = await request(app).get(`/authors/1239128/books`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });
});

describe("POST /authors/:idAuthor/books", () => {
  it("should create new instance of bookAuthor", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const response = await request(app)
      .post(`/authors/${createdAuthor.id}/books`)
      .send({
        isbn: "SK123122ACC13213",
        title: "SOME BOOK NAME",
        pages: 233,
        published: 2024,
        image: "https://example.com/images/jane-austen.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book added to the author successfully");
  });

  it("should return 404 if author not found", async () => {
    const response = await request(app)
      .post(`/authors/123123/books`)
      .send({
        isbn: "SK123122ACC13213",
        title: "SOME BOOK NAME",
        pages: 233,
        published: 2024,
        image: "https://example.com/images/jane-austen.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });

  it("should create new book if book not found and add that book to author ", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const response = await request(app)
      .post(`/authors/${createdAuthor.id}/books`)
      .send({
        isbn: "1A232AAXC324A123423AA",
        title: "Neka knjiga",
        pages: 232,
        published: 1,
        image: "https://path-of-basdaook",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book added to the author successfully");
  });

  it("should return message book already added", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "SK1231221323213",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdAuthor.addBook(createdBook);

    const response = await request(app)
      .post(`/authors/${createdAuthor.id}/books`)
      .send({
        isbn: "SK1231221323213",
        title: "SOME BOOK NAME",
        pages: 233,
        published: 2024,
        image: "https://example.com/images/jane-austen.jpg",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book is already added to the author");
  });
});

describe("DELETE /authors/:idAuthor/:idBook", () => {
  it("should delete selected book from author", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "MFDSASDSAYXC",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    await createdAuthor.addBook(createdBook);

    const response = await request(app).delete(
      `/authors/${createdAuthor.id}/books/${createdBook.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Book removed from the author successfully",
    );
  });

  it("shoud return 404 if no author", async () => {
    const response = await request(app).delete(`/authors/12312/books/435345`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Author not found");
  });

  it("shoud return 404 if no book", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const response = await request(app).delete(
      `/authors/${createdAuthor.id}/books/435345`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });

  it("shoud return that author is not realted to book", async () => {
    const createdAuthor = await models.Author.create({
      id: uuidv4(),
      firstName: "Mark",
      lastName: "Twain",
      dob: new Date("1835-11-30"),
      image: "https://example.com/images/mark-twain.jpg",
    });

    const createdBook = await models.Book.create({
      isbn: "MFDSASDSAYXSS",
      title: "SOME BOOK NAME",
      pages: 233,
      published: 2024,
      image: "https://example.com/images/jane-austen.jpg",
    });

    const response = await request(app).delete(
      `/authors/${createdAuthor.id}/books/${createdBook.id}`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Author is not related with this book");
  });
});
