import * as bnb from "bread-n-butter"

export class Replacer<A> {
  private constructor(private parser: bnb.Parser<A>) {
  }
  static define(parser: bnb.Parser<unknown>): Replacer<unknown> {
    const def = new bnb.Parser(ctx => {
      let i = 0
      const result = parser.parse(ctx.input)
      const results = [result]
      while (i < ctx.input.length) {
        i++;
        for (let j = 0; j < i; j++) {
          results.push(parser.parse(ctx.input.substring(j, i)))
        }
      }
      return ctx.ok(ctx.input.length, results.filter(v => v.type === "ParseOK").map((v: any) => v.value))
    })
    return new Replacer(def)
  }
  evaluate(input: string): any {
    return (this.parser.tryParse(input) as any)
  }
}