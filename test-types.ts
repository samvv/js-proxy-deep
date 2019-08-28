
import { assert } from "chai"
import DeepProxy = require('.')

interface DB {
  [key: string]: DB
  (): string[];
}

const db = new DeepProxy<DB>({} as any, {
  get(target, path, receiver) {
    return this.nest()
  },
  apply(target, thisArg, argList) {
    return this.path;
  }
})

assert.lengthOf(db.select.from.where.whut(), 5)

