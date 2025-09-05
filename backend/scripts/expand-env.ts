/* 
 * Script to generate a `.env.prisma` file with only the required database-related
 * environment variables.
 */

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import fs from "fs";

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
