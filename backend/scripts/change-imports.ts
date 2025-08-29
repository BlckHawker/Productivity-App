import fs from "fs";
import path from "path";



 /**
 * Map of relative paths → extension rules per context.
 * Keys should be relative to the project root or script working dir.
 * Check for a file-specific override first (highest priority).
 * If no file override exists, check if it’s inside a directory override.
 * If neither exists, fall back to the default target extension.
 */
const overrideMap: Record<string, { test?: string; build?: string }> = {
  "src/requestHandlers/task.ts": { test: "", build: "js" },
  "src": { test: "ts", build: "js" },

};

// "ts" for tests, "js" for build/preview
const targetExtension = process.argv[2];

if (!["ts", "js"].includes(targetExtension)) {
  console.error("Please specify 'ts' or 'js' as the target extension.");
  process.exit(1);
}

// Regex to match import/export paths with extensions
const importRegex = /(from\s+["'])(\.{1,2}\/.+?)\.(ts|js)(["'])/g;;

// Determine which extension to use for a file
function getExtensionForFile(relativeFilePath: string): string {
  // File-specific override
  if (overrideMap[relativeFilePath]) {
    const rule = overrideMap[relativeFilePath];
    return targetExtension === "ts" ? rule.test ?? targetExtension : rule.build ?? targetExtension;
  }

  // Directory override (longest match wins)
  let matchedDir: string | null = null;
  for (const key in overrideMap) {
    if (relativeFilePath.startsWith(key + "/")) {
      if (!matchedDir || key.length > matchedDir.length) {
        matchedDir = key;
      }
    }
  }

  if (matchedDir) {
    const rule = overrideMap[matchedDir];
    return targetExtension === "ts" ? rule.test ?? targetExtension : rule.build ?? targetExtension;
  }

  // Default
  return targetExtension;
}

/**
 * Process a single file relatively
 */
function processFile(filePath: string, relativeFilePath: string) {
  let content = fs.readFileSync(filePath, "utf8");

  content = content.replace(importRegex, (_match, prefix, importPath, _oldExt, suffix) => {
    const ext = getExtensionForFile(relativeFilePath);
    return ext ? `${prefix}${importPath}.${ext}${suffix}` : `${prefix}${importPath}${suffix}`;
  });

  fs.writeFileSync(filePath, content, "utf8");
}

// Recursively process a directory
function walkDir(dir: string, overrideKey: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativeFilePath = path.join(overrideKey, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      walkDir(fullPath, relativeFilePath);
    } else if (entry.isFile() && fullPath.endsWith(".ts")) {
      processFile(fullPath, relativeFilePath);
    }
  }
}


// Process all entries in overrideMap
for (const overrideKey in overrideMap) {
  const fullPath = path.join(process.cwd(), overrideKey);
  if (!fs.existsSync(fullPath)) continue;

  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    walkDir(fullPath, overrideKey);
  } else if (stat.isFile()) {
    processFile(fullPath, overrideKey);
  }
}

console.log(`All imports updated to .${targetExtension}`);
