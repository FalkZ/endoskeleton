import { textWidth } from "./utils.ts";

const lorem = `
Lorem ipsum dolor sit amet, consetetur
 sadipscing elitr, sed diam nonumy eirmod 
 tempor invidunt ut 😋 labore et dolore 
 magna aliquyam 
 erat, sed diam voluptua. At vero eos et accusam et justo 
 duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata 
 sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, cons sadipscifldfkdfng elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

const splitAtWidth = (str, index) => {
  let i = index;
  let a;

  if (textWidth(str) < index) return [str];

  do {
    a = str.substring(0, i);

    if (textWidth(a) > index) i -= 1;
    else if (textWidth(a) < index - 1) i += 1;
  } while (textWidth(a) > index || textWidth(a) < index - 1);

  const indexOfLastSpace = a.lastIndexOf(" ");

  if (indexOfLastSpace > index / 2)
    return [
      str.substring(0, indexOfLastSpace),
      str.substring(indexOfLastSpace),
    ];
  return [a, str.substring(i)];
};

export const createColumns = (
  text: string,
  { indent, width }: { indent?: string; width: number }
) => {
  indent ||= " ";

  const lines = [];
  const a = text.split("\n");

  a.forEach((l) => {
    let rest = l;
    let r;
    do {
      const [a, b] = splitAtWidth(rest, width);
      lines.push(a);
      r = b;
      rest = indent + b;
    } while (r);
  });

  const pad = (str) => {
    const w = textWidth(str);
    if (w === width) return str;
    return str + new Array(width - w).fill(" ").join("");
  };

  return lines.map(pad);
};
