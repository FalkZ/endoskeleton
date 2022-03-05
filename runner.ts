import { parse as parseYaml } from "https://deno.land/std@0.63.0/encoding/yaml.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { runCommand } from "./runCommand.ts";

const text = await Deno.readTextFile("./endo.yaml");
const config = parseYaml(text);

console.log(config);

const args = parse(Deno.args);

const command = args._.shift();

const definedCommands = () =>
  console.log(`commands defined in endo.yaml:
${Object.keys(config).join("\n")}
`);

const printHelp = () => {
  console.log(`endoskeleton v0.0.1

run commands with \`endoskeleton [commands]\`
`);
  definedCommands();
};

if (!command) {
  printHelp();
  Deno.exit(0);
} else if (!config[command]) {
  console.log(`command \`${command}\` not found
    `);
  definedCommands();
  Deno.exit(1);
} else {
  const c = config[command];
  runCommand(c, args._);
}
