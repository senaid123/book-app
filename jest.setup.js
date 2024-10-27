import { initializeTestEnvironment, cleanupDatabase } from "./tests/setup.js";

beforeAll(async () => {
  await initializeTestEnvironment();
});

afterEach(async () => {
  await cleanupDatabase();
});
