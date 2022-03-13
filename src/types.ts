import { TypeBuilder } from "https://deno.land/x/typebox@0.23.4/src/typebox.ts";

interface Comment<T> {
  description(description: string): T & Comment<T>;
}

type Types = {
  [Key in keyof TypeBuilder]: AddReturnUnion<TypeBuilder[Key]>;
};

type AddReturnUnion<F> = F extends (...args: infer PrevArgs) => infer R
  ? (...args: PrevArgs) => R & Comment<R>
  : never;

export const types: Types = new Proxy(new TypeBuilder(), {
  get: (target, key) => {
    return (...args: any[]) => {
      const obj = target[key](...args);
      return Object.defineProperty(obj, "comment", {
        enumerable: false,
        configurable: false,
        value: function (description: string) {
          return { ...this, description };
        },
      });
    };
  },
});
