
const _ = require('lodash')
const assert = require('chai').assert
const proxyDeep = require('.')

describe('a proxy supporting deep nesting', () => {

  it('passes all events by default', () => {
    const p = proxyDeep({
      foo: 'bar',
      baz: 'bax'
    }, {})
    console.log(p.foo)
    assert(p.foo === 'bar', 'foo equals bar')
    assert(p.baz === 'bax', 'baz equals bax')
    assert(p.bla === undefined, 'unknown property returns undefined')
  })

  it('makes a property of a certain depth return a certain string', () => {
    const p = proxyDeep({}, {
      get(target, path, nest) {
        return (_.toPath(path).length === 2) ? 'foo everywhere!' : nest()
      }
    })
    assert(typeof p.bla === 'object')
    assert(p.bla.baz === 'foo everywhere!', 'not equal to expected string')
  })

})



