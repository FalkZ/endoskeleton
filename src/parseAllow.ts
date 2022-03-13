const prefixAllow = (str) => "--allow-" + str;

export const parseAllow = (allow) => {
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
