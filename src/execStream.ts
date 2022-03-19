import {
  readableStreamFromReader,
  writableStreamFromWriter,
  readableStreamFromIterable,
} from "https://deno.land/std@0.130.0/streams/conversion.ts";
import { mergeReadableStreams } from "https://deno.land/std@0.130.0/streams/merge.ts";
import { readLines } from "https://deno.land/std@0.105.0/io/bufio.ts";

export const execStream = (cmd: string[]): ReadableStream<Uint8Array> => {
  const shell = ["cmd", "/c"];
  const process = Deno.run({
    cmd: [...shell, ...cmd],
    stdout: "piped",
    stderr: "piped",
  });

  // example of combining stdout and stderr while sending to a file
  const stdout = readLines(process.stdout, {
    encoding: "UTF-8",
    ignoreBOM: true,
  });
  const stderr = readLines(process.stderr);
  const joined = mergeReadableStreams(
    readableStreamFromIterable(stdout),
    readableStreamFromIterable(stderr)
  );

  return joined;
};
