// One-Line Office Joke Laugh-Off — make.fun entry
// Writes one original one-line office joke to /output/entry.txt and
// verifies the file byte-for-byte before exiting.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const ENTRY_PATH = join(OUTPUT_DIR, "entry.txt");

// The joke: an original one-liner, fresh angle, no office cliches.
const JOKE = "Our org chart is just a pyramid scheme with better stationery.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate the joke the same way the sealed scorer does: UTF-8 text,
// 1 to 200 characters, not only whitespace, exactly one line,
// no leading or trailing whitespace.
if (JOKE.length < 1 || JOKE.length > 200) {
  fail(`joke is ${JOKE.length} characters, must be 1-200`);
}
if (JOKE.trim() !== JOKE) {
  fail("joke has leading or trailing whitespace");
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("joke must be a single line");
}

// Make sure the output directory exists, then delete only its
// contents — never the directory itself, which the grader mounts.
mkdirSync(OUTPUT_DIR, { recursive: true });
for (const entry of readdirSync(OUTPUT_DIR)) {
  rmSync(join(OUTPUT_DIR, entry), { recursive: true, force: true });
}

writeFileSync(ENTRY_PATH, JOKE, "utf8");

// Read it back and verify byte-for-byte: same string and same UTF-8
// byte length, so no encoding surprise can slip through.
const written = readFileSync(ENTRY_PATH, "utf8");
if (written !== JOKE) {
  fail("entry.txt does not match the joke byte-for-byte");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(JOKE, "utf8")) {
  fail("entry.txt byte length does not match the joke");
}

console.log(`wrote ${ENTRY_PATH} (${JOKE.length} characters): ${JOKE}`);
