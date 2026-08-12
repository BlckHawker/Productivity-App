import fs from "fs";
import path from "path";

const target = process.argv[2] as "test" | "build";
if (!["test", "build"].includes(target)) {
	console.error("Please specify 'test' or 'build'");
	process.exit(1);
}

/**
 * Direct override map.
 * Keys are relative path *fragments* to look for in an import string.
 */
const map: Record<string, { test?: string; build?: string }> = {
	"src/server": { test: "", build: "js" },
	"src/utils": { test: "", build: "js" },
	"src/requestHandlers/": { test: "", build: "js" },
	"src/controllers/": { test: "", build: "js" },
	"src/services/": { test: "", build: "js" },
	"src/requestHandlers/section": { test: "", build: "js" },
	"tests/src/": { test: "", build: "js" },
};
// tests/src/
// tests/server
const importRegex = /(from\s+["'])(\.{1,2}\/[^"']+?)(?:\.(ts|js))?(["'])/g;

function processFile(filePath: string) {
	let content = fs.readFileSync(filePath, "utf8");

	content = content.replace(
		importRegex,
		(_m, prefix, importPath, _oldExt, suffix) => {
			// never rewrite prisma imports
			if (importPath.includes("generated/prisma")) {
				return _m;
			}

			// resolve import path relative to the file
			const absImportPath = path.resolve(path.dirname(filePath), importPath);
			const relImportPath = path
				.relative(process.cwd(), absImportPath)
				.replace(/\\/g, "/");

			

			// check if this resolved path is in the map
			const rule = map[relImportPath];
			if (rule) {
				const ext = rule[target];
				const newImport =
					ext === ""
						? `${prefix}${importPath}${suffix}`
						: `${prefix}${importPath}.${ext}${suffix}`;
				return newImport;
			}

			//check if the current directory matches one in the map
			for (const [key, rule] of Object.entries(map)) {
				if (key.endsWith("/") && relImportPath.startsWith(key.slice(0, -1))) {
					const ext = rule[target];
					return ext === "" ? `${prefix}${importPath}${suffix}` : `${prefix}${importPath}.${ext}${suffix}`;
				}
			}

			// untouched if not in map
			return _m;
		}
	);

	fs.writeFileSync(filePath, content, "utf8");
}

function walkDir(dir: string) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) walkDir(fullPath);
		else if (entry.isFile() && fullPath.endsWith(".ts")) processFile(fullPath);
	}
}

walkDir(path.join(process.cwd(), "src"));

console.log(`Rewritten imports for ${target}`);
