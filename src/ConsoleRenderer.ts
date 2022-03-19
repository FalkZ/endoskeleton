const ESC = "\x1b"; // ASCII escape character

const CSI = ESC + "["; // control sequence introducer

const CLEAR_LINE = CSI + "K";
const MOVE_CURSOR_UP = CSI + "A";

export const csiMatch = /\x1b\[[A-Z]/g;
export class ConsoleRenderer {
  private numberOfLines = 0;

  private write(text: string) {
    Deno.stdout.writeSync(new TextEncoder().encode(text));
  }

  private getCSIPrefix(linesToDelete) {
    return (
      "\r" +
      new Array(linesToDelete).fill(CLEAR_LINE).join(MOVE_CURSOR_UP + "\r")
    );
  }

  update(text: string) {
    const n = String(text).split("\n").length;

    // this.write(this.getCSIPrefix(this.numberOfLines + 2));
    console.log(text);
    this.numberOfLines = n;
  }
}
