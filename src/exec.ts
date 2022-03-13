export const exec = async (command: string[], silent: boolean) => {
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
