import addFormats from "https://jspm.dev/ajv-formats@2.1.1";
import Ajv from "https://jspm.dev/ajv@8.10.0/dist/2019";

//--------------------------------------------------------------------------------------------
//
// Setup AJV validator with the following options and formats
//
//--------------------------------------------------------------------------------------------
const ajv = addFormats(new Ajv({}), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
])
  .addKeyword("kind")
  .addKeyword("modifier");

export type validate = (
  schema: any,
  value: any
) => { valid: boolean; error?: any };
export const validate = (schema: any, value: any) => {
  const validate = ajv.compile(schema);

  const valid = validate(value);

  return { valid, error: validate.errors };
};
