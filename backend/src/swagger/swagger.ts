import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"


const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Productivity App API Docs",
            version: "0.1.0"
        }
    },
    apis: ["./src/routes"]
}

const swaggerSpecs = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
    app.get("/docs/json", (_: Request, res: Response) => {
        res.setHeader("Content-Type","application/json");
        res.send(swaggerSpecs);
    })

    console.log(`Docs available at http://localhost:${port}/api`);
}

export default swaggerDocs;