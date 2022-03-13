const addTemplateToPrimitive = (schema) => {
  return {
    anyOf: [
      schema,
      {
        $ref: "#/$defs/templateLiteral",
      },
    ],
  };
};
const extendObjectTemplateSyntax = (obj: Object) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      extendSchemaTemplateSyntax(value),
    ])
  );

export const extendSchemaTemplateSyntax = (schema) => {
  if (schema.type === "object") {
    const r = { ...schema };

    if (schema.properties)
      r.properties = extendObjectTemplateSyntax(schema.properties);
    if (schema.patternProperties)
      r.patternProperties = extendObjectTemplateSyntax(
        schema.patternProperties
      );

    return r;
  }

  if (schema.type === "array") {
    const r = { ...schema };
    if (schema.items) r.items = extendSchemaTemplateSyntax(schema.items);
    return r;
  }

  if (schema.anyOf)
    return { ...schema, anyOf: schema.anyOf.map(extendSchemaTemplateSyntax) };

  if (schema.allOf)
    return { ...schema, allOf: schema.allOf.map(extendSchemaTemplateSyntax) };

  if (typeof schema === "object") {
    return addTemplateToPrimitive(schema);
  }

  console.error("could not get primitive type", schema);
  throw new Error("could not get primitive type");
};
