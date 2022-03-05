import Template from "https://deno.land/x/template@v0.1.0/mod.ts";
import { walkObject } from "./walkObject.ts";

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

const exec = async (command: string[]) => {
  let shell;
  if (Deno.build.os === "windows") shell = ["cmd", "/c"];
  else shell = ["bash", "-c"];

  const cmd = Deno.run({
    cmd: [...shell, ...command],
    stdout: "piped",
    stderr: "piped",
  });

  const p = await cmd; // "piped" must be set

  const decoder = new TextDecoder();

  const status = await p.status();
  if (status.success) console.log(decoder.decode(await p.output()));
  else console.error(decoder.decode(await p.stderrOutput()));

  cmd.close();
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

    await exec(["deno", "run", "--no-check", c.script, "--args", a]);
  }
};
