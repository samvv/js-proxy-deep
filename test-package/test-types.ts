
//import { assert } from "chai"
import DeepProxy from "proxy-deep"

interface DB {
  [key: string]: DB
  (): string[];
}

declare module "proxy-deep" {
  interface TrapThisArgument<T extends object> { 
    foo?: string;
  }
}

const db = new DeepProxy<DB>({} as any, {
  get(_target, _path, _receiver) {
    this.foo = 'bar';
    return this.nest()
  },
  apply(_target, _thisArg, _argList) {
    return this.path;
  }
})

//const result = db.select.from.where.whut();
//assert(result.length == 5)
//assert(result[0] == 'select')
//assert(result[1] == 'from')
//assert(result[2] == 'where')
//assert(result[3] == 'whut')
