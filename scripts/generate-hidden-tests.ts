import { writeFileSync } from "node:fs";
import { problems, testsForProblem } from "../src/data/problems";

const catalog: Record<string, Array<{ input: string; expected: string }>> = {};
for (const problem of problems) {
  const hidden = testsForProblem(problem.id, "hidden").map((test) => ({
    input: test.input,
    expected: test.expectedOutput,
  }));
  if (hidden.length) catalog[problem.slug] = hidden;
}

const body =
  "/** Generated. Do not import from the Vite app. Hidden tests stay on the judge. */\n" +
  "export const HIDDEN_TESTS: Record<string, Array<{ input: string; expected: string }>> = " +
  JSON.stringify(catalog, null, 2) +
  ";\n";

writeFileSync(new URL("../supabase/functions/code-runner/hiddenTests.ts", import.meta.url), body);
console.log(`Wrote ${Object.keys(catalog).length} problems, ${Object.values(catalog).reduce((n, t) => n + t.length, 0)} hidden tests.`);
