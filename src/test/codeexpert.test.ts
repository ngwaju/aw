import { describe, it, expect } from "vitest";
import { frogExpected, parseHarvest, solveHarvest } from "@/components/codeexpert";

describe("Frog Feeding DP", () => {
  it("with zero jumps eats only the start pad", () => expect(frogExpected(3, 1, 0, [1, 5, 2], [0.5, 0.5, 0.5])).toBe(5));
  it("weights both neighbours by p", () => expect(frogExpected(3, 1, 1, [1, 5, 2], [0.5, 0.25, 0.5])).toBeCloseTo(5 + 0.25 * 1 + 0.75 * 2));
});
describe("Great Harvest", () => {
  it("answers y when supply covers demand", () => expect(solveHarvest(parseHarvest("2 1 0 3 1 1 0 2 0 1")!).ok).toBe(true));
  it("answers n when demand exceeds supply", () => expect(solveHarvest(parseHarvest("2 0 0 1 1 1 0 2")!).ok).toBe(false));
});
