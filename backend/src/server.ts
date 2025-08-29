
import express from "express";
import { PrismaClient } from "../generated/prisma/index.ts";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import router from "./router.ts";

async function startServer() {
  try {
    const port = 3000;

    // Load and expand .env variables
    const env = dotenv.config();
    dotenvExpand.expand(env);

    // Set up Prisma and Express
    const prisma = new PrismaClient();
    const app = express();

    app.use((req, _res, next) => {
      req.prisma = prisma;
      next();
    });

    //parse JSON request bodies
    app.use(express.json());
    //add routes
    router(app);


    app.listen(port, () => console.log(`Listening to port ${port}`));
  } catch (e) {
    console.error('Startup error:', e);
    process.exit(1);
  }
}

startServer();