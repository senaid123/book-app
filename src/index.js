import { app } from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT;
const start = async () => {
  app.listen(PORT || 8000, () => {
    console.log(`Running on port ${PORT || 8000}`);
  });
};

start();
