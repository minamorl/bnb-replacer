import * as bnb from "bread-n-butter"


export type OKType<A> ={
    start: bnb.SourceLocation;
    value: A;
    end: bnb.SourceLocation;
}

export class Replacer {
  _internalParser: bnb.Parser<OKType<string>[]>
  constructor(private parser: bnb.Parser<string>) {
    const locationParser = bnb.all(bnb.location, parser, bnb.location).map(([start, value, end]) => ({ start, value, end }))
    const def = new bnb.Parser(ctx => {
      let i = 0
      const result = locationParser.parse(ctx.input)
      const results = [result]
      while (i < ctx.input.length) {
        i++;
        for (let j = 0; j < i; j++) {
          const r = locationParser.parse(ctx.input.substring(j, i))
          // Shift start index to the actual location
          r.type === "ParseOK" && (r.value.start.index += j) && (r.value.end.index += j)
          results.push(r)
        }
      }
      return ctx.ok(
        ctx.input.length,
        (results.filter(v => v.type === "ParseOK") as unknown as bnb.ParseOK<OKType<string>>[]).map(v => v.value)
      )
    })
    this._internalParser = def
  }
  evaluate(input: string): any {
    const parsed = this._internalParser.tryParse(input)
    let result = input
    let offset = 0
    for (const p of parsed) {
      result = this.replaceBetween({start: p.start.index + offset, end: p.end.index + offset, value: p.value, str: result})
      offset -= p.end.index - p.start.index - p.value.length
    }
    return result
  }
  private replaceBetween(data: {start: number, end: number, str: string, value: string}) {
    const r = data.str.substring(0, data.start) + data.value + data.str.substring(data.value.length + data.end - 1)
    return r
  }
}