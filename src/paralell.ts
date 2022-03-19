import { execStream } from "./execStream.ts";
import { mergeReadableStreams } from "https://deno.land/std@0.130.0/streams/merge.ts";
import cliFormat from "https://deno.land/x/cli_format_deno@3.0.10/src/mod.ts";
import { ConsoleRenderer, csiMatch } from "./ConsoleRenderer.ts";
import { createColumns } from "./column.ts";

class AddIndex extends TransformStream {
  constructor(index: number, size: number) {
    super({
      decoder: new TextDecoder("utf-8"),
      start() {}, // required.
      async transform(chunk, controller) {
        chunk = await chunk;
        if (chunk === null) controller.terminate();
        else {
          controller.enqueue({ index, size, data: chunk });
        }
      },
      flush() {
        /* do any destructor work here */
      },
    });
  }
}

const size = Deno.consoleSize(Deno.stdout.rid);

class ConvertToTable extends TransformStream {
  constructor() {
    super({
      columns: null,
      start() {}, // required.
      async transform(chunk, controller) {
        chunk = await chunk;
        if (chunk === null) return controller.terminate();

        if (!this.columns) this.columns = new Array(chunk.size).fill([]);

        const d = chunk.data.replace(csiMatch, "").replace(/\r/g, "");
        this.columns[chunk.index].push(...createColumns(d, { width: 20 }));

        console.log(this.columns);

        controller.enqueue("");
      },
      flush() {
        /* do any destructor work here */
      },
    });
  }
}

export const parallel = (...commands: string[][]) => {
  const streams = commands.map((value, index, all) =>
    execStream(value).pipeThrough(new AddIndex(index, all.length))
  );

  return mergeReadableStreams(...streams);
};

const it = parallel(
  ["npx parcel demo/indexä.html"],
  ["npx parcel demo/indexö.html"],
  ["dir"]
); // ["ipconfig"]);

//let columns = new Array(3).fill([]);

interface Chunk {
  data: string;
  index: number;
}

class Columns {
  private columns: string[][];

  private width = 20;
  private placeholder = " ".repeat(this.width);
  constructor(nr: number) {
    this.columns = new Array(nr).fill(null).map(() => []);
  }

  addChunk(chunk: Chunk) {
    const cols = createColumns(chunk.data, { width: this.width });
    //console.log(cols, this.columns[chunk.index]);
    this.columns[chunk.index].push(...cols);
    this.print();
  }

  private allColumnsHaveData(): boolean {
    return this.columns.reduce((acc, b) => {
      // console.log(acc, b.length);
      return acc && b.length;
    }, true);
  }

  private aColumnHasData(): boolean {
    return this.columns.reduce((acc, b) => {
      // console.log(acc, b.length);
      return acc || b.length;
    }, false);
  }

  private getRow() {
    return this.columns.map((c) => c.shift() || this.placeholder);
  }

  private printAnyway() {
    while (this.aColumnHasData()) {
      console.log(this.getRow().join("│"));
    }
  }
  private print() {
    while (this.allColumnsHaveData()) {
      console.log(this.getRow().join("│"));
    }
    setTimeout(() => this.printAnyway(), 1000);
  }
}

const c = new Columns(3);
for await (const chunk of it) {
  c.addChunk(chunk);
}
