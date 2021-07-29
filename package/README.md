
This is a library which enables users to "trap" deeply nested objects into
[proxies][1]. The API is identical to the proxy API, except that traps get
an additional `this` context with a method for nesting the current proxied
object into a deeper one.

✨ Now updated with support for TypeScript! See the [change log][2] for more information.

🚀 All external dependencies have been stripped, making this library self-contained!

## Examples

A simple example for DSL query building: 

```js
const DeepProxy = require('proxy-deep');

const db = new DeepProxy({}, {
  get(target, path, receiver) {
    return this.nest(function () {})
  },
  apply(target, thisArg, argList) {
    return this.path;
  }
})

console.log(db.select.from.where()) // outputs ['select', 'from', 'where']
```

Another example using Node's [process](https://nodejs.org/api/process.html) object:

```js
const DeepProxy = require('proxy-deep')
const { EventEmitter } = require('events')

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
  console.log(`${path} was accessed.`)
})

pp.argv[0] // trapped!
```

## API

```js
import DeepProxy from "proxy-deep"
```

```js
import { DeepProxy, TrapThisArgument, DeepProxyHandler } from "proxy-deep"
```

### TrapThisArgument&lt;T&gt;

A TypeScript type that holds all information about the `this` argument inside a
proxy trap.

To speed things up, the same `this`-argument is shared between calls to
different traps. You should not make use of this implementation detail, and
instead pass any information you wish to share in a custom object inside
`options.userData`.

### new DeepProxy(target, handlers, [options])

Identical to `new Proxy(target, handlers)`, except that the callbacks provided
in the `traps` object will be called wiith a `this`-context that has some
additional properties. For a full reference on what arguments are provided to
the handlers, please consult the a
[MDN web docs][3].

`options` is an object that can contain the following entries:

 - **path** either a string denoting the full path to the object or an array of property keys
 - **userData** an object of which the enumerable properties will be copied to
   the `this`-argument of a proxy trap handler

### this.rootTarget

A reference to the object with wich the deep proxy was created.

### this.path

Holds the full property path to the given object.

### this.nest([nestedTarget])

Returns a new proxy that will trap methods as described in this API.
`nestedTarget` is an optional object with which the proxy will be initialized.
If it is not specified, the target that was passed to `new DeepProxy()` will be
used.

### handler.getPrototypeOf()

A trap for Object.getPrototypeOf.

### handler.setPrototypeOf()

A trap for Object.setPrototypeOf.

### handler.isExtensible()

A trap for Object.isExtensible.

### handler.preventExtensions()

A trap for Object.preventExtensions.

### handler.getOwnPropertyDescriptor()

A trap for Object.getOwnPropertyDescriptor.

### handler.defineProperty()

A trap for Object.defineProperty.

### handler.has()

A trap for the in operator.

### handler.get()

A trap for getting property values.

### handler.set()

A trap for setting property values.

### handler.deleteProperty()

A trap for the delete operator.

### handler.ownKeys()

A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.

### handler.apply()

A trap for a function call.

### handler.construct()

A trap for the new operator.

## License

The MIT License

[1]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[2]: https://github.com/samvv/js-proxy-deep/blob/master/package/CHANGELOG.md
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler

