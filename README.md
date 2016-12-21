
This is a library which enables users to "trap" deeply nested objects into
[proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
The API is identical to the proxy API, except that keys are now paths in the
object, and that a special `nest()`-procedure is added to the _get_-trap as
a parameter.

A simple example using Node's [process](https://nodejs.org/api/process.html) object:

```js
const proxyDeep = require('proxy-deep')
const _ = require('lodash')
const { EventEmitter } = require('events')

const emitter = new EventEmitter()

const pp = proxyDeep(process, {
  get(p, path, nest) {
    const val = _.get(p, path)
    if (typeof val !== 'object') {
      emitter.emit('access', path)
      return val
    } else {
      return nest()
    }
  }
})

emitter.on('access', path => {
  console.log(`${path} was accessed.`)
})

pp.argv[0] // trapped!
```
