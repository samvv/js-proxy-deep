
import { assert } from "chai"
import DeepProxy from "proxy-deep"

interface DB {
  [key: string]: DB;
  (): string[];
}

declare module "proxy-deep" {
  interface TrapThisArgument<T extends object> { 
    foo?: string;
  }
}

const db = new DeepProxy<DB>(function () {} as any, {
  get(_target, _path, _receiver) {
    this.foo = 'bar';
    // @ts-expect-error
    this.bazaa 
    return this.nest();
  },
  apply(_target, _thisArg, _argList) {
    return this.path;
  }
});

describe('ProxyDeep', () => {

  it('returns the access chain when calling it', () => {
    const result = db.select.from.where.whut();
    assert.equal(result.length, 4);
    assert.equal(result[0], 'select');
    assert.equal(result[1], 'from');
    assert.equal(result[2], 'where');
    assert.equal(result[3], 'whut');
  });

});
