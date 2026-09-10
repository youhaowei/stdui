import { renderTokens } from "../src/tokens/render";

const output = new URL("../src/styles/tokens.css", import.meta.url);
// Use the repository formatter so generated output also passes format --check.
const formatter = Bun.spawn(
  ["bun", "x", "--no-install", "oxfmt", "--stdin-filepath", "tokens.css"],
  {
    stdin: new Blob([renderTokens()]),
    stdout: "pipe",
    stderr: "inherit",
  },
);
const css = await new Response(formatter.stdout).text();
if ((await formatter.exited) !== 0) throw new Error("Could not format generated tokens");
if (process.argv.includes("--check")) {
  if ((await Bun.file(output).text()) !== css) {
    throw new Error("tokens.css is stale. Run bun run build:tokens and commit the result.");
  }
  console.log("tokens.css matches src/tokens/schema.ts");
} else {
  await Bun.write(output, css);
  console.log("Generated src/styles/tokens.css");
}
