//todo write a header comment for this file
import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const env = dotenv.config();
dotenvExpand.expand(env);

const keysToInclude = [
  "DATABASE_USERNAME",
  "DATABASE_PASSWORD",
  "DATABASE_LOCALHOST",
  "DATABASE_PORT",
  "DATABASE_URL"
];

const expandedEnv = Object.entries(process.env)
  .filter(([key]) => keysToInclude.includes(key))
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

fs.writeFileSync(".env.prisma", expandedEnv);
console.log(".env.prisma created with expanded DATABASE_URL");
