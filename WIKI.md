# Overview

This project is a full-stack application with a React frontend and a Node.js / Express backend using TypeScript.

- The frontend communicates with the backend API to display and manage tasks.
- The backend handles API requests, interacts with a PostgreSQL database via Prisma, and contains all business logic.
- Automated tests are set up for both frontend and backend using Jest, with coverage enforcement.
- The project uses Vite for frontend development and build tooling.

The project is organized so that the **root `package.json`** mainly coordinates scripts across both frontend and backend, while most dependencies live in the respective folder (`frontend/package.json` or `backend/package.json`).
# First-Time Setup

Follow these steps to get the project running locally:

## 1. Clone the Repository

`git clone https://github.com/BlckHawker/Productivity-App.git`

## 2. Install PostgreSQL

- Ensure PostgreSQL version 17 is installed on your machine.
- Create a database for development:
   - While the official database is called `productivity_app_db`, what you name it is up to you as it should not have any affects on building/deploying the project

`CREATE DATABASE <DATABASE_NAME>;` 

## 3. Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
- Copy `example.env` and rename it to `.env`
- Configure the following variables:
    - `DATABASE_USERNAME` – PostgreSQL username
    - `DATABASE_PASSWORD` – PostgreSQL password
    - `DATABASE_LOCALHOST` – Hostname of the database (`localhost` for local development)
    - `DATABASE_PORT` – Database port (default: `5432`)
    - `DATABASE_NAME` – Name of your development database
    - `DATABASE_URL` – Complete database URL. This should **not** be changed from `example.env`

4. expand the dependencies
```bash
npm run expand-env
```

5. Generate the Prisma client
```bash
npm run prisma:generate
```

6. Apply initial database migrations:
```bash
npm run migrate:dev
```

## 4. Frontend Setup

1. Navigate to the frontend folder:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `example.env` and rename it to `.env`
- Configure the following variable:
    - `VITE_BACKEND_URL` – URL of the backend API (e.g., `http://localhost:3000`)
## 5. Run the Application

- Start the backend server:
```bash
cd backend
npm run dev
```

- Start the frontend server:
```
cd frontend
npm run dev
```

- Open your browser at the localhost port to see the app.
# `package.json` scripts
These scripts are shortcuts defined in `package.json` for common development tasks like building, running, testing, and database migrations. You run them with `npm run <script>` from the correct folder (`frontend`, `backend`, or `root`), depending on which part of the project they affect.

## Root
| Script                   | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `build`                  | Build both frontend and backend.                        |
| `build:frontend`         | Build the frontend only.                                |
| `build:backend`          | Build the backend only.                                 |
| `test`                   | Run backend tests                                       |
| `test:coverage`          | Run coverage tests for backend.                         |

## Frontend
| Script          | Description                                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`           | Starts the local development server with Vite.                                                                                                            |
| `build`         | Creates a build of the project.                                                                                                                           |
| `preview`       | Creates a build of the project and serves it locally                                                                                                      |

## Backend
| Script            | Description                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`             | Generate Prisma client, then start the server in development mode.                                                                                        |
| `build`           | Generate Prisma client, then compile TypeScript to JavaScript.                                                                                            |
| `start`           | Run the compiled production server.                                                                                                                       |
| `expand-env`      | Run a script to process environment variables.                                                                                                            |
| `migrate:dev`     | Apply development database changes                                                                                                                        |
| `migrate:prod`    | Apply all pending database migrations to production.                                                                                                      |
| `prisma:generate` | Generate Prisma client from the schema.                                                                                                                   |
| `test`            | Runs all Jest tests. If no tests exist, the command still succeeds without error.                                                                         |
| `test:coverage`   | Runs tests and shows how much of your code is covered by tests. Fails if less than 90% of your branches, functions, lines, or statements are covered.     |

# File Structure
When installing new packages, make sure they go into the correct `package.json`. Backend-only packages belong in `backend/package.json`, frontend-only packages in `frontend/package.json`. The root `package.json` is mainly for scripts that coordinate both. If you think a package belongs at the root, check with the maintainers first.
## Frontend
```
frontend
|   .env                 # Local environment variables
|   .gitignore           # Files/folders Git should ignore
|   example.env          # Example of required environment variables for setup
|   index.html           # Main HTML entry point for the frontend
|   package-lock.json    # (auto-generated)
|   package.json         # Project info, dependencies, and scripts
|   README.md            # Project instructions and overview
|   tsconfig.app.json    # TypeScript settings for app source files
|   tsconfig.json        # Base TypeScript configuration
|   tsconfig.node.json   # TypeScript settings for Node-related files
|   vite.config.ts       # Vite build and dev server configuration
|
+---.vite                
|   \---deps             # Cached dependency builds for faster startup
|
+---public               
|       vite.svg         
|
+---src                  # All application source code
|   |   App.css          # Styles for the main App component
|   |   App.tsx          # Main React component of the app
|   |   index.css        # Global CSS styles
|   |   interfaces.ts    # TypeScript type/interface definitions
|   |   main.tsx         # App entry point (renders App to the DOM)
|   |   vite-env.d.ts    # TypeScript types for Vite features
|   |
|   +---api              # Functions for backend API calls
|   |       task.ts      # API requests related to tasks
|   |       utils.ts     # Helper functions for API calls
|   |
|   +---assets           # Project-specific images/icons
|   |       react.svg    # React logo asset
|   |
|   \---components       # Reusable React components
|
\---tests                # Automated test files
        placeholder.test.ts  # Example test file

```

## Backend
```
backend
|   .env                 # Local environment variables
|   .env.prisma          # Environment variables specifically for Prisma
|   .gitignore           # Files/folders Git should ignore
|   example.env          # Example environment variables for setup
|   package-lock.json    # (auto-generated)
|   package.json         # Project info, dependencies, and scripts
|   tsconfig.json        # TypeScript configuration for the backend
|
+---prisma               # Database schema and migration files
|   |   schema.prisma    # Prisma database schema definition
|
+---scripts              # Utility scripts for backend setup/maintenance
|       expand-env.ts    # Script to process/expand environment variables
|
+---src                  # Backend source code
|   |   prisma.ts        # Prisma client instance for database access
|   |   router.ts        # Central API route definitions
|   |   server.ts        # Main server entry point
|   |   utils.ts         # Helper functions used in backend code
|   |
|   +---controllers      # Middle layer: calls services
|   |       task.ts      # Task-related controller functions
|   |
|   +---requestHandlers  # Handles HTTP requests/responses
|   |       task.ts      # Express request handlers for task routes
|   |
|   +---services         # DB queries via Prisma
|   |       task.ts      # Task-related service functions
|   |
|   \---types            # TypeScript type definitions
|           express.d.ts # Custom Express type definitions
```