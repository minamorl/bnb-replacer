import * as bnb from "bread-n-butter"
import { Replacer } from "./bnbreplacer"
test("replacable", () => {
  const result = new Replacer(bnb.text("{").next(bnb.match(/[a-z]/).skip(bnb.text("}")))).evaluate("{a}{b}{c}{d}{e}")
  expect(result).toBe("abcde")
})

test("replacable with non-replaced text", () => {
  const result = new Replacer(bnb.text("{").next(bnb.match(/[a-z]/).skip(bnb.text("}")))).evaluate("{a}{b}{c}{d}{e}aaaaa{f}")
  expect(result).toBe("abcdeaaaaaf")
})