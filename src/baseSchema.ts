const baseSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    // specific types
  },
  additionalProperties: {
    anyOf: [
      {
        type: "object",
        properties: {
          command: {
            type: "string",
          },
        },
        additionalProperties: false,
        required: ["command"],
      },
      {
        $ref: "#/$defs/script",
      },
    ],
  },
  $defs: {
    templateLiteral: {
      type: "string",
      pattern: "^\\$\\{[0-9]+\\}$",
    },
    stringOrTrue: {
      anyOf: [
        {
          type: "string",
        },
        {
          const: true,
        },
      ],
    },
    script: {
      type: "object",
      properties: {
        script: {
          type: "string",
        },
        args: {},
        allow: {
          anyOf: [
            {
              type: "object",
              properties: {
                hrtime: {
                  const: true,
                },
                env: {
                  $ref: "#/$defs/stringOrTrue",
                },
                ffi: {
                  $ref: "#/$defs/stringOrTrue",
                },
                net: {
                  $ref: "#/$defs/stringOrTrue",
                },
                read: {
                  $ref: "#/$defs/stringOrTrue",
                },
                run: {
                  $ref: "#/$defs/stringOrTrue",
                },
                write: {
                  $ref: "#/$defs/stringOrTrue",
                },
              },
              additionalProperties: false,
            },
            {
              const: "all",
            },
            {
              type: "array",
              items: {
                type: "string",
                enum: ["hrtime", "ffi", "net", "read", "write", "run"],
              },
              additionalItems: false,
            },
          ],
        },
      },
      additionalProperties: false,
      required: ["script"],
    },
  },
};

export default baseSchema;
