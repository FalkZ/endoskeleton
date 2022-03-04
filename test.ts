import { Type } from "https://deno.land/x/typebox@0.23.4/src/typebox.ts";

import { args } from "./args.ts";

const r = args(
  Type.Object({
    foo: Type.Integer(),
    bar: Type.String(),
  })
);

console.log("got arguments:", r);
