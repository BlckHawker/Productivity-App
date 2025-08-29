import fs from "fs";
import path from "path";

const directories = [
  "src/controllers",
  "src/requestHandlers",
  "src/services",
  "src/utils.ts",
  "tests/src/controllers",
  "tests/src/requestHandlers",
  "tests/src/utils.test.ts"
];

// "ts" for tests, "js" for build/preview
const targetExtension = process.argv[2];

if (!["ts", "js"].includes(targetExtension)) {
  console.error("Please specify 'ts' or 'js' as the target extension.");
  process.exit(1);
}

// Regex to match import/export paths with extensions
const importRegex = /(from\s+["'])(\.{1,2}\/.+?)\.(ts|js)(["'])/g;;

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");

  content = content.replace(importRegex, (_match, prefix, importPath, _oldExt, suffix) => {
    let path = `${prefix}${importPath}.${targetExtension}${suffix}`
    return path;
});




  fs.writeFileSync(filePath, content, "utf8");
}

function processPath(p: string) {
  const fullPath = path.join(process.cwd(), p);
  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) {
    // recursively process all .ts files in this directory
    walkDir(fullPath);
  } else if (stat.isFile() && fullPath.endsWith(".ts")) {
    processFile(fullPath);
  }
}

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

// Process each directory
for (const dir of directories) {
  processPath(dir);
}

console.log(`All imports updated to .${targetExtension}`);
