import Template from "https://deno.land/x/template@v0.1.0/mod.ts";

const tpl = new Template({
  open: "\\${",
  close: "}",
});
export const renderTemplate = (template: string, variables: Object) => {
  const index = /^\$\{([0-9])+\}$/.exec(template)?.[1];
  if (index) return variables[index];
  return tpl.render(template, variables);
};
export const resolveTemplateValues = (args, variables) => {
  return args.map((arg) => renderTemplate(arg, variables));
};
