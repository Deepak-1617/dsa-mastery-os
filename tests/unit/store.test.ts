import { beforeEach, describe, expect, it } from "vitest";
import { topics } from "../../src/data/topics";
import { mutate, reloadFromStorage, resetDatabase, storeGeneration } from "../../src/store/db";
import {
  addRevision,
  currentProfile,
  listRevision,
  listTopicProgress,
  login,
  register,
  saveTopicProgress,
} from "../../src/store/api";

describe("local workspace persistence", () => {
  beforeEach(() => {
    resetDatabase();
  });

  it("registers, logs in, and restores topic status", async () => {
    await register("ada@example.com", "secret1", "Ada");
    saveTopicProgress(topics[0].id, "ONGOING");
    expect(listTopicProgress()[0].status).toBe("ONGOING");
    const { logout } = await import("../../src/store/api");
    logout();
    expect(currentProfile()).toBeNull();
    await login("ada@example.com", "secret1");
    expect(currentProfile()?.displayName).toBe("Ada");
    expect(listTopicProgress()[0].status).toBe("ONGOING");
  });

  it("logs in after sign-out and a simulated browser reload", async () => {
    await register("ada@example.com", "secret1", "Ada");
    const { logout } = await import("../../src/store/api");
    logout();
    reloadFromStorage();
    expect(currentProfile()).toBeNull();
    await login("ada@example.com", "secret1");
    expect(currentProfile()?.email).toBe("ada@example.com");
  });

  it("explains a missing local account instead of a generic auth error", async () => {
    await expect(login("nobody@example.com", "secret1")).rejects.toThrow(/No account is saved/);
  });

  it("bumps store generation so React can re-render after in-place writes", () => {
    const before = storeGeneration();
    mutate(() => {});
    expect(storeGeneration()).toBeGreaterThan(before);
  });

  it("does not duplicate open revision items", async () => {
    await register("bob@example.com", "secret1", "Bob");
    const first = addRevision({ problemId: "p1", reason: "Failed sample" });
    const second = addRevision({ problemId: "p1", reason: "Failed again" });
    expect(first.id).toBe(second.id);
    expect(listRevision()).toHaveLength(1);
  });
});
