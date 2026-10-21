import { describe, expect, it } from "vitest";
import { arraysLessons } from "../../src/data/lessons/arrays/index";
import { wrapSnippetToMain } from "../../src/lib/javaPlayground";
import { lessonsForTopic } from "../../src/data/lessons";
import { getTopic } from "../../src/data/topics";
import {
  javaFileName,
  mapPistonPayload,
  mapWandboxPayload,
  sourceForWandbox,
} from "../../src/lib/javaRunner";

describe("Java runner mapping", () => {
  it("never marks a custom run as graded", () => {
    const ok = mapWandboxPayload({ status: "0", program_output: "hi\n", program_error: "", compiler_error: "" });
    expect(ok.graded).toBe(false);
    expect(ok.status).toBe("COMPLETED");
    expect(ok.stdout).toBe("hi\n");
  });

  it("maps compiler errors without inventing success", () => {
    const failed = mapWandboxPayload({
      status: "1",
      program_output: "",
      compiler_error: "prog.java:1: error: class Main is public",
    });
    expect(failed.status).toBe("COMPILE_ERROR");
    expect(failed.graded).toBe(false);
  });

  it("maps piston runtime failure", () => {
    const failed = mapPistonPayload({
      compile: { code: 0, stderr: "" },
      run: { code: 1, stdout: "", stderr: "Exception" },
    });
    expect(failed.status).toBe("RUNTIME_ERROR");
    expect(failed.graded).toBe(false);
  });

  it("strips public class for Wandbox and names the piston file", () => {
    const source = "public class Main { public static void main(String[] args) {} }";
    expect(sourceForWandbox(source).startsWith("class Main")).toBe(true);
    expect(javaFileName(source)).toBe("Main.java");
  });
});

describe("playground wrapping", () => {
  it("calls the method from main with Scanner sc", () => {
    const source = wrapSnippetToMain(`static int findMax(int[] numbers) {
        int m = numbers[0];
        for (int v : numbers) if (v > m) m = v;
        return m;
    }`);
    expect(source).toContain("Scanner sc = new Scanner(System.in)");
    expect(source).toContain("findMax(numbers)");
    expect(source).not.toMatch(/Call your method/i);
  });
});

describe("Arrays teaching template", () => {
  it("is a five-part textbook chapter with runnable programs", () => {
    const topic = getTopic("arrays");
    expect(topic).toBeTruthy();
    const list = lessonsForTopic(topic!.id);
    expect(list.length).toBeGreaterThanOrEqual(8);
    const programs = arraysLessons.flatMap((lesson) => [
      ...(lesson.content.workedPrograms ?? []),
      ...(lesson.content.sections ?? []).flatMap((section) => section.programs ?? []),
    ]);
    expect(programs.length).toBeGreaterThanOrEqual(10);
    expect(programs.every((program) => program.dryRun.steps.length > 0 && program.time && program.space)).toBe(true);
    expect(programs.filter((program) => program.level === "basic").length).toBeGreaterThanOrEqual(6);
    expect(programs.some((program) => program.level === "pattern")).toBe(true);
    expect(programs.some((program) => program.level === "interview")).toBe(true);
    expect(programs.every((program) => program.visualizer && program.visualizer.steps.length > 0)).toBe(true);
  });
});

describe("textbook curriculum", () => {
  it("gives every topic unique Scanner sc programs with dry-runs", async () => {
    const { topics } = await import("../../src/data/topics");
    const { lessonsForTopic } = await import("../../src/data/lessons");
    expect(topics).toHaveLength(22);
    for (const topic of topics) {
      const list = lessonsForTopic(topic.id);
      expect(list.length, topic.slug).toBeGreaterThanOrEqual(topic.slug === "arrays" ? 8 : 5);
      const programs = list.flatMap((lesson) => (lesson.content.sections ?? []).flatMap((section) => section.programs ?? []));
      expect(programs.length, topic.slug).toBeGreaterThanOrEqual(5);
      expect(programs.every((program) => program.code.includes("Scanner sc = new Scanner(System.in)"))).toBe(true);
      expect(programs.every((program) => program.dryRun.steps.length > 0 && program.time && program.space)).toBe(true);
      expect(programs.every((program) => program.visualizer && program.visualizer.steps.length > 0)).toBe(true);
      const definitions = new Set(list.map((lesson) => lesson.content.definition));
      expect(definitions.size, `${topic.slug} unique definitions`).toBe(list.length);
      if (topic.slug !== "arrays") {
        expect(
          list.every((lesson) => !lesson.content.builtins.some((b) => b.name === "array.length")),
          topic.slug,
        ).toBe(true);
      }
    }
  });
});
