import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Productivity App API Docs",
            version: "0.1.0"
        }
    },
    apis: [path.resolve(__dirname, "../requestHandlers/*.ts")]
}

const swaggerSpecs = swaggerJsdoc(options);

//todo put header comment
function swaggerDocs(app: Express, port: number) {
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
    app.get("/docs/json", (_: Request, res: Response) => {
        res.setHeader("Content-Type","application/json");
        res.send(swaggerSpecs);
    })

    console.log(`Docs available at http://localhost:${port}/api`);
}

export default swaggerDocs;