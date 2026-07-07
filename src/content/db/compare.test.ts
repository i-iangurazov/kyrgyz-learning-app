import { describe, expect, it } from "vitest";

import { canonicalJson } from "@/content/db/compare";

describe("canonicalJson", () => {
  it("ignores object key order and undefined optional fields", () => {
    expect(
      canonicalJson({
        b: "two",
        a: { d: undefined, c: "one" },
      }),
    ).toBe(canonicalJson({ a: { c: "one" }, b: "two" }));
  });

  it("preserves array order", () => {
    expect(canonicalJson(["a", "b"])).not.toBe(canonicalJson(["b", "a"]));
  });
});
