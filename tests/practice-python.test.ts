import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { challenges } from "../src/data/practice";
const assertions: Record<string, string> = {
  "quiet-channel":
    "assert longest_quiet([4,8,4,2,9]) == 4\nassert longest_quiet([]) == 0",
  "parcel-budget": "assert capacity([2,3,2,5],2) == 7",
  "free-shuttles": "assert walking([[(1,1),(2,0)],[],[(1,0)]]) == [0,0,0]",
  "energy-ledger":
    "assert count_stretches([2,-1,2,1],3) == 2\nassert count_stretches([0,0],0) == 3",
  "workshop-slots": "assert attend([[1,4],[2,3],[3,5],[5,6]]) == 3",
  "repair-tokens": "assert tokens([1,4,6],8) == 2\nassert tokens([2],3) == -1",
  "build-order":
    "assert build(4,[[0,2],[1,2],[2,3]]) == [0,1,2,3]\nassert build(2,[[0,1],[1,0]]) == []",
  "trail-links": "assert groups(5,[[0,1],[1,2],[3,4]]) == 2",
};
describe("trusted authored practice references", () => {
  it.each(challenges.map((c) => [c.id, c.code]))(
    "matches the worked examples for %s",
    (id, code) => {
      const result = spawnSync(
        "python3",
        ["-c", code + "\n" + assertions[id]],
        { encoding: "utf8" },
      );
      expect(result.stderr).toBe("");
      expect(result.status).toBe(0);
    },
  );
});
