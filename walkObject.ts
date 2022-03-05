export const walkObject = (obj, fn) => {
  if (Array.isArray(obj)) return obj.map((value) => walkObject(value, fn));
  if (obj === null) return fn(obj);
  else if (typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, walkObject(value, fn)])
    );

  return fn(obj);
};
