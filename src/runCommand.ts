import { walkObject } from "./walkObject.ts";
import { resolveTemplateValues, renderTemplate } from "./template.ts";
import { parseAllow } from "./parseAllow.ts";
import { parseArgs } from "./parseArgs.ts";
import { exec } from "./exec.ts";

export const runCommand = async (c, variables) => {
  if (c.command) {
    let a = parseArgs(c);

    a = resolveTemplateValues([c.command, ...a], variables);

    await exec([...a]);
  } else if (c.script) {
    let a = walkObject(c.args, (value) => {
      if (typeof value === "string") return renderTemplate(value, variables);
      return value;
    });

    a = JSON.stringify(a);

    const allow = parseAllow(c.allow);

    await exec(["deno", "run", "--no-check", ...allow, c.script, "--args", a]);
  }
};
