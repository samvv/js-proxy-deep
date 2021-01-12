
const { assert } = require('chai')
const DeepProxy = require('.')
const { EventEmitter } = require('events')

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

  it('can configure the start path', () => {
    const p = new DeepProxy({}, {
      get(target, prop, receiver) {
        assert.deepEqual(this.path, ['foo', 'bar', 'baz'])
      }
    }, { path: 'foo.bar.baz' });
    p.bax
  })

  it('can trap property setters', () => {
    const p = new DeepProxy({}, {
      get(target, prop, receiver) {
        if (prop === 'baz') {
          return this.path
        }
        return this.nest();
      },
      set(obj, prop, value) {
        assert.strictEqual(value, 'bar')
        assert.deepEqual(this.path, ['foo'])
      }
    })
    p.foo.bar = 'bar'
  })

  it('can trap the constructor', () => {
    const p = new DeepProxy(function() {}, {
      get(target, prop, receiver) {
        return this.nest(function() {});
      },
      construct(target, args) {
        assert.strictEqual(args[0], 'foo')
        return { answer: 42 }
      }
    })
    assert.deepEqual(new p.bar.baz('foo'), { answer: 42 })
  })

  it('can trap applications', () => {
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


  it('works on the first example in the README', () => {

    const DeepProxy = require('proxy-deep');

    const db = new DeepProxy({}, {
      get(target, path, receiver) {
        return this.nest(function () { })
      },
      apply(target, thisArg, argList) {
        return this.path;
      }
    })

    assert.deepEqual(db.select.from.where(), ['select', 'from', 'where']);

  });

  it('works on the second example in the README', (done) => {

    const emitter = new EventEmitter()

    const pp = DeepProxy(process, {
      get(target, key, receiver) {
        const val = Reflect.get(target, key, receiver);
        if (typeof val === 'object' && val !== null) {
          return this.nest({})
        } else {
          emitter.emit('access', this.path)
          return val
        }
      }
    })

    emitter.on('access', path => {
      assert.deepEqual(path, ['argv'])
      done();
    })

    pp.argv[0] // trapped!

  })

  it('can pass arbitrary user data to this', (done) => {

    const p = new DeepProxy({}, {
      get(target, key, receiver) {
        assert(this.foo === true);
        done();
      }
    }, { userData: { foo: true } });

    p.bla

  })

})

