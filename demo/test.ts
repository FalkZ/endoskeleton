import { args, types } from "../lib.ts";

const r = args(
  types.Object({
    foo: types.Integer().comment("foo description"),
    bar: types.String(),
  })
);

console.log("got arguments:", r);
