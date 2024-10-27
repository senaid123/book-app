import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Book App API Documentation",
    version: "1.0.0",
    description: "API documentation for the Book App",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
    {
      url: "https://production.api.com",
      description: "Production server",
    },
  ],
  components: {
    schemas: {
      Author: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique identifier for the author",
          },
          firstName: {
            type: "string",
            description: "Name of the author",
          },
          lastName: {
            type: "string",
            description: "Last name of the author",
          },
          dob: {
            type: "string",
            format: "date-time",
            description: "Date of birth of author",
          },
          image: {
            type: "string",
            description: "Author image",
          },
        },
        required: ["id", "firstName", "lastName", "dob", "image"],
      },
      Book: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "Unique identifier for the book",
          },
          isbn: {
            type: "string",
            description: "Unique ISBN code for the book",
          },
          title: {
            type: "string",
            description: "Title of the book",
          },
          pages: {
            type: "integer",
            description: "Number of pages",
          },
          published: {
            type: "integer",
            description: "Year of pulication",
          },
          image: {
            type: "string",
            description: "Book of image",
          },
        },
        required: ["id", "isbn", "title", "pages", "published", "image"],
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
