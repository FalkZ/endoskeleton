import { Type } from "https://deno.land/x/typebox@0.23.4/src/typebox.ts";

import { args, types } from "../lib.ts";

const r = args(
  types.Object({
    foo: types.Integer().comment("foo description"),
    bar: types.String(),
  })
);

console.log("got arguments:", r);
