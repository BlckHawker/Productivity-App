/**
 * Script to ease the process of upgrading node modules across the repository.
 * Deletes `node_modules` and `package-lock.json` in the root, frontend, and backend
 * directories, then reinstalls dependencies using `npm install`.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const dirs = [".", "backend", "frontend"];

for (const dir of dirs) {
  const nodeModules = path.join(dir, "node_modules");
  const lockFile = path.join(dir, "package-lock.json");

  console.log(`Cleaning ${dir}...`);

  if (fs.existsSync(nodeModules)) {
    fs.rmSync(nodeModules, { recursive: true, force: true });
  }

  if (fs.existsSync(lockFile)) {
    fs.rmSync(lockFile, { force: true });
  }

  console.log(`Installing dependencies in ${dir}...`);
  execSync("npm install", { cwd: dir, stdio: "inherit" });
}

console.log("Dependencies updated successfully.");