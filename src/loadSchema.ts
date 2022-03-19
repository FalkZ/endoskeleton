import baseSchema from "./baseSchema.ts";
import { extendSchemaTemplateSyntax } from "./extendSchemaTemplateSyntax.ts";
import { exec } from "./exec.ts";

export const loadSchema = async (script) => {
  let schema = await exec(
    ["deno", "run", "--no-check", script, "--schema"],
    true
  );
  let s = JSON.parse(schema);
  s = extendSchemaTemplateSyntax(s);
  return s;
};

const retry = (times: number, action: () => Promise<any>) => {
  if (times <= 1) return action();
  return action().catch(() => retry(times - 1, action));
};

export const loadSchemas = async (config) => {
  const schemas = Object.fromEntries(
    await Promise.all(
      Object.entries(config)
        .filter(([key, value]) => value.script)
        .map(async ([key, value]) => {
          const schema = await loadSchema(value.script);
          return [
            key,
            {
              allOf: [
                {
                  type: "object",
                  properties: {
                    script: {
                      const: value.script,
                    },
                    args: schema,
                  },

                  required: ["args"],
                },
                { $ref: "#/$defs/script" },
              ],
            },
          ];
        })
    )
  );

  const s = baseSchema;
  s.properties = schemas;

  await retry(5, () =>
    Deno.writeTextFile("./.endo-schema.json", JSON.stringify(s, null, 2))
  ).catch((e) => {
    console.error(
      `The schema: ./.endo-schema.json couldn't be updated (${e.message})`
    );
    Deno.exit(1);
  });
};
