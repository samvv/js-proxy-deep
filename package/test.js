"use strict";

var _chai = require("chai");
var _index = _interopRequireDefault(require("./index.mjs"));
var _events = require("events");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('a proxy supporting deep nesting', () => {
  it('transparently mimicks the original object by default', () => {
    const p = new _index.default({
      foo: 'bar',
      baz: 'bax',
      bla() {
        return 1;
      }
    }, {});
    _chai.assert.strictEqual(p.foo, 'bar');
    _chai.assert.strictEqual(p.baz, 'bax');
    _chai.assert.strictEqual(p.bla(), 1);
    _chai.assert.isUndefined(p.baa);
  });
  it('makes a property of a certain depth return a certain string', () => {
    const p = new _index.default({}, {
      get(target, key, reciever) {
        return this.path.length === 1 ? 'foo everywhere!' : this.nest();
      }
    });
    _chai.assert.isDefined(p.bla);
    _chai.assert.strictEqual(p.bla.baz, 'foo everywhere!');
    _chai.assert.strictEqual(p.abla.baaal, 'foo everywhere!');
    _chai.assert.strictEqual(p.baaa.baar, 'foo everywhere!');
  });
  it('can configure the start path', () => {
    const p = new _index.default({}, {
      get(target, prop, receiver) {
        _chai.assert.deepEqual(this.path, ['foo', 'bar', 'baz']);
      }
    }, {
      path: 'foo.bar.baz'
    });
    p.bax;
  });
  it('can trap property setters', () => {
    const p = new _index.default({}, {
      get(target, prop, receiver) {
        if (prop === 'baz') {
          return this.path;
        }
        return this.nest();
      },
      set(obj, prop, value) {
        _chai.assert.strictEqual(value, 'bar');
        _chai.assert.deepEqual(this.path, ['foo']);
        return true;
      }
    });
    p.foo.bar = 'bar';
  });
  it('can trap the constructor', () => {
    const p = new _index.default(function () {}, {
      get(target, prop, receiver) {
        return this.nest(function () {});
      },
      construct(target, args) {
        _chai.assert.strictEqual(args[0], 'foo');
        return {
          answer: 42
        };
      }
    });
    _chai.assert.deepEqual(new p.bar.baz('foo'), {
      answer: 42
    });
  });
  it('can trap applications', () => {
    const p = new _index.default(function () {}, {
      apply(target, thisArg, argumentsList) {
        return 'i was applied!';
      }
    });
    _chai.assert.strictEqual(p(), 'i was applied!');
  });
  it('can nest on applications', () => {
    const p = new _index.default(function () {}, {
      get() {
        return this.path;
      },
      apply(target, thisArg, argumentsList) {
        return this.nest(function () {});
      }
    });
    _chai.assert.deepEqual(p()()().foo, []);
  });
  it('works on the first example in the README', () => {
    const db = new _index.default({}, {
      get(target, path, receiver) {
        return this.nest(function () {});
      },
      apply(target, thisArg, argList) {
        return this.path;
      }
    });
    _chai.assert.deepEqual(db.select.from.where(), ['select', 'from', 'where']);
  });
  it('works on the second example in the README', done => {
    const emitter = new _events.EventEmitter();
    const pp = (0, _index.default)(process, {
      get(target, key, receiver) {
        const val = Reflect.get(target, key, receiver);
        if (typeof val === 'object' && val !== null) {
          return this.nest({});
        } else {
          emitter.emit('access', this.path);
          return val;
        }
      }
    });
    emitter.on('access', path => {
      _chai.assert.deepEqual(path, ['argv']);
      done();
    });
    pp.argv[0]; // trapped!
  });
  it('can pass arbitrary user data to this', done => {
    const p = new _index.default({}, {
      get(target, key, receiver) {
        (0, _chai.assert)(this.foo === true);
        done();
      }
    }, {
      userData: {
        foo: true
      }
    });
    p.bla;
  });
});