
This is a library which enables users to "trap" deeply nested objects into
[proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
The API is identical to the proxy API, except that keys are now paths in the
object, and that a special `nest()`-procedure is added to the _get_-trap as
a parameter. The default behavior is to mimick the object that has been passed
through as first argument.

## Examples

A simple example for DSL language building: 

```js
const db = proxyDeep({}, {
  get(target, path, nest) {
    return nest()
  },
  apply(target, path, thisArg, argumentsList) {
    return path
  }
})
console.log(db.select.from.where()) // outputs ['select', 'from', 'where']
```

Another example using Node's [process](https://nodejs.org/api/process.html) object:

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

## API

### proxyDeep(root, handlers, opts?)

Currently, no additional options are supported.

All handlers are called with the first and second argument `root` and `path`.
The rest is identical to JavaScript's _Proxy_ handler arguments.

### handlers.get(root, path, reciever)

A trap for the property accessor.

### handlers.set(root, path, newValue, receiver)

A trap for the property setter.

### handlers.has(root, path)

A trap for the `in`-keyword.

### handlers.deleteProperty(root, path) 

A trap for the `delete` keyword.

### handlers.apply(root, path, thisArg, argumentsList)

A trap for a function application.

### handlers.construct(root, path, argumentsList, newTarget)

A trap for the `new`-keyword.

### handlers.getOwnPropertyDescriptor(root, path)

A trap for `Object.getOwnPropertyDescriptor()`.

### handlers.ownKeys(root, path)

A trap for `Object.getOwnPropertyNames`.

### handler.getPrototypeOf(root, path)

A trap for `Object.getPrototypeOf()`.

### handler.setPrototypeOf(root, path)

A trap for `Object.setPrototypeOf()`.

### handler.isExtensible(root, path)

A trap for `Object.isExtensible()`.

### handler.preventExtensions(root, path)

A trap for `Object.preventExtensions()`.

## Contributing

If anyone is willing to write some good tests I would greatly appreciate it.
Open a pull request and I'll merge when I have the time!

