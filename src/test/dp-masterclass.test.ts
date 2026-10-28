import { describe, it, expect } from "vitest";
import { coinTable, diceExpected, selfLoopSteps, gauss } from "@/components/dp-masterclass";

describe("DP masterclass", () => {
  it("coin: two fair coins, exactly 1 head = 0.5", () => expect(coinTable([0.5, 0.5], 1)[0]![1]).toBeCloseTo(0.5));
  it("coin: at least 1 head = 0.75", () => expect(coinTable([0.5, 0.5], 1, true)[0]![1]).toBeCloseTo(0.75));
  it("dice: sum ≥ 1 needs exactly 1 roll", () => expect(diceExpected(1)[0]).toBe(1));
  it("dice: sum ≥ 2 needs 1 + 1/6 rolls", () => expect(diceExpected(2)[0]).toBeCloseTo(7 / 6));
  it("self-loop: n/(1−p)", () => expect(selfLoopSteps(5, 0.5)).toBe(10));
  it("gauss solves 2x2", () => expect(gauss([[2, 1], [1, 3]], [3, 5])!.map((x) => +x.toFixed(6))).toEqual([0.8, 1.4]));
});
