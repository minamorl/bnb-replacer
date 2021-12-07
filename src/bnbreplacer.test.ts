import * as bnb from "bread-n-butter"
import { Replacer } from "./bnbreplacer"
test("replacable", () => {
  const result = Replacer.define(bnb.text("{").next(bnb.match(/[a-z]/).skip(bnb.text("}")))).evaluate("{a}{b}{c}{d}{e}")
  expect(result.join("")).toBe("abcde")
})
