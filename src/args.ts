import { Static } from "https://deno.land/x/typebox@0.23.4/src/typebox.ts";
import { validate } from "./validator.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

export const args = <T>(schema: T): Static<T> => {
  const a = parse(Deno.args);

  if (a.schema) {
    console.log(JSON.stringify(schema));
    Deno.exit(0);
  } else if (a.args) {
    const data = JSON.parse(a.args);
    const result = validate(schema, data);
    if (result.valid) return data;
    else {
      console.error(
        result.error[0].instancePath + " " + result.error[0].message
      );
      Deno.exit(1);
    }
  } else {
    console.error("you must supply an argument --args or --schema");
    Deno.exit(1);
  }
};
