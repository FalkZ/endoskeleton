export const parseArgs = (command): string[] => {
  if (!command.args) return [];
  if (Array.isArray(command.args)) return command.args;
  if (typeof command.args === "object" && command.args !== null)
    return Object.entries(command.args).flat();

  throw new Error("Invalid content of field args");
};
