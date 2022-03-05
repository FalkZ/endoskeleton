import { deepEqual } from "https://deno.land/x/cotton@v0.7.3/src/utils/deepequal.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.128.0/testing/asserts.ts";
import { walkObject } from "../walkObject.ts";

Deno.test("walkObject", () => {
  const actual = walkObject(
    { a: 123, b: [1, 2, "w", { a: 3 }], 1: null },
    (v) => "visited-" + v
  );

  const expected = {
    1: "visited-null",
    a: "visited-123",
    b: ["visited-1", "visited-2", "visited-w", { a: "visited-3" }],
  };

  assert(deepEqual(expected, actual));
});

Deno.test("walkObject", () => {
  const actual = walkObject(null, (v) => v);

  const expected = null;

  assertEquals(expected, actual);
});
