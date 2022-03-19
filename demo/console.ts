import AsciiTable, {
  AsciiAlign,
} from "https://deno.land/x/ascii_table@v0.1.0/mod.ts";

import cliFormat from "https://deno.land/x/cli_format_deno@3.0.10/src/mod.ts";
import { ConsoleRenderer } from "./ESC";

const size = Deno.consoleSize(Deno.stdout.rid);

console.log(size);

const col1 = "This columnlkfdj\nuses defaults";
const col2 = "This column uses a custom configuratiosdjflaskfjsajlkfn.";

const result = cliFormat.columns.wrap([col1, col2], {
  width: size.columns,
  paddingMiddle: " ¦ ",
  //hangingIndent: "",
  hardBreak: " ",
});

console.log(result);

const t = [result, 123, "djf\nfsjklf\n", 1, "1\n¦"];

const c = new ConsoleRenderer();

const write = (index) => {
  setTimeout(() => {
    c.update(t[index]);
    write(index + 1);
  }, 2000);
};

write(0);
