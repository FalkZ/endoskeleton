import Template from "https://deno.land/x/template@v0.1.0/mod.ts";
import { walkObject } from "./walkObject.ts";
import baseSchema from "./baseSchema.ts";

const parseArgs = (command): string[] => {
  if (!command.args) return [];
  if (Array.isArray(command.args)) return command.args;
  if (typeof command.args === "object" && command.args !== null)
    return Object.entries(command.args).flat();

  throw new Error("Invalid content of field args");
};

const tpl = new Template({
  open: "\\${",
  close: "}",
});

const resolveTemplateValues = (args, variables) => {
  return args.map((arg) => tpl.render(arg, variables));
};

const exec = async (command: string[], silent: boolean) => {
  let shell;
  if (Deno.build.os === "windows") shell = ["cmd", "/c"];
  else shell = ["bash", "-c"];

  if (!silent) console.log(...command);
  const cmd = Deno.run({
    cmd: [...shell, ...command],
    stdout: "piped",
    stderr: "piped",
  });

  const p = await cmd; // "piped" must be set

  const decoder = new TextDecoder();

  const status = await p.status();
  let r = "";
  if (status.success) r = decoder.decode(await p.output());
  else console.error(decoder.decode(await p.stderrOutput()));

  cmd.close();

  if (!silent) console.log(r);
  return r;
};

const prefixAllow = (str) => "--allow-" + str;

const parseAllow = (allow) => {
  if (!allow) return [];
  if (Array.isArray(allow)) allow.map(prefixAllow);
  if (typeof allow === "object")
    return Object.entries(allow)
      .map(([key, value]) => {
        if (typeof value === "string") return `${key}=${value}`;
        if (value === true) return key;

        throw new Error("invalid allow settings");
      })
      .map(prefixAllow);

  throw new Error("invalid allow settings");
};

export const loadSchema = async (script) => {
  let schema = await exec(
    ["deno", "run", "--no-check", script, "--schema"],
    true
  );
  return JSON.parse(schema);
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

  await Deno.writeTextFile("./.endo-schema.json", JSON.stringify(s, null, 2));
};

export const runCommand = async (c, variables) => {
  if (c.command) {
    let a = parseArgs(c);

    a = resolveTemplateValues([c.command, ...a], variables);

    await exec([...a]);
  } else if (c.script) {
    let a = walkObject(c.args, (value) => {
      if (typeof value === "string") return tpl.render(value, variables);
      return value;
    });

    a = JSON.stringify(a);

    const allow = parseAllow(c.allow);

    await exec(["deno", "run", "--no-check", ...allow, c.script, "--args", a]);
  }
};
