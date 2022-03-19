import { parse as parseYaml } from "https://deno.land/std@0.63.0/encoding/yaml.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { runCommand } from "./runCommand.ts";
import { loadSchemas } from "./loadSchema.ts";
import { globToRegExp } from "https://deno.land/std@0.129.0/path/glob.ts";

import { bgBlue } from "https://deno.land/std@0.129.0/fmt/colors.ts";
import { writeAllSync } from "https://deno.land/std@0.129.0/streams/conversion.ts";

const text = await Deno.readTextFile("./endo.yaml");
const config = parseYaml(text);

const args: Object = parse(Deno.args);

const definedCommands = () =>
  console.log(`commands defined in endo.yaml:
${Object.keys(config).join("\n")}
`);

const printHelp = () => {
  console.log(`endoskeleton v0.0.1

run commands with \`endoskeleton <command>\`
`);
  definedCommands();
};

const parseCommand = (globCommand: string, possibleCommands: string[]) => {
  const regex: RegExp = globToRegExp(globCommand);
  const matchedCommands = possibleCommands.filter((command) =>
    regex.test(command)
  );

  if (matchedCommands.length > 1) {
    throw new Error(
      "command " +
        globCommand +
        " did match multiple commands: " +
        matchedCommands.join(", ")
    );
  } else if (matchedCommands.length === 0) {
    console.error(`command \`${globCommand}\` not found
          `);
    definedCommands();
    Deno.exit(1);
  }

  return matchedCommands[0];
};

const command = parseCommand(args._.shift(), Object.keys(config));

if (!command) {
  printHelp();
} else {
  writeAllSync(
    Deno.stdout,
    new TextEncoder().encode(bgBlue(` ${command} `) + "  ")
  );
  const c = config[command];
  runCommand(c, args._);
}

await loadSchemas(config);
