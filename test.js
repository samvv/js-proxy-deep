
const toPath = require('lodash/toPath')
const assert = require('chai').assert
const DeepProxy = require('.')

describe('a proxy supporting deep nesting', () => {

  it('transparently mimicks the original object by default', () => {
    const p = new DeepProxy({
      foo: 'bar',
      baz: 'bax',
      bla() { return 1 },
    }, {})
    assert.strictEqual(p.foo, 'bar');
    assert.strictEqual(p.baz, 'bax');
    assert.strictEqual(p.bla(), 1);
    assert.isUndefined(p.baa);
  })

  it('makes a property of a certain depth return a certain string', () => {
    const p = new DeepProxy({}, {
      get(target, key, reciever) {
        return (this.path.length === 1) ? 'foo everywhere!' : this.nest()
      }
    })
    assert.isDefined(p.bla);
    assert.strictEqual(p.bla.baz, 'foo everywhere!');
    assert.strictEqual(p.abla.baaal, 'foo everywhere!');
    assert.strictEqual(p.baaa.baar, 'foo everywhere!');
  })

  it('trap applications', () => {
    const p = new DeepProxy(function () {}, {
      apply(target, thisArg, argumentsList) {
        return 'i was applied!';
      }
    })
    assert.strictEqual(p(), 'i was applied!');
  });

  it('can nest on applications', () => {
    const p = new DeepProxy(function () {}, {
      get() {
        return this.path;
      },
      apply(target, thisArg, argumentsList) {
        return this.nest(function () {});
      }
    })
    assert.deepEqual(p()()().foo, []);
  });


})



