import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { swaggerSpec } from "../swagger.js";

import { bookRouter } from "./routes/book.js";
import { authorRouter } from "./routes/author.js";
import sequelize from "./models/index.js"

if (process.env.NODE_ENV === 'production') {
    sequelize.sync({ alter: true });
}

const app = express();

app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

app.use(bookRouter);
app.use(authorRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };
