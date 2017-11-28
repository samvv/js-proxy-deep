
This is a library which enables users to "trap" deeply nested objects into
[proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
The API is identical to the proxy API, except that traps get an additional
`this` context with a method for nesting the current proxied object into a
deeper one.

## Examples

A simple example for DSL language building: 

```js

const DeepProxy = require('proxy-deep');

const db = new DeepProxy({}, {
  get(target, path, receiver) {
    return this.nest()
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
      return nest()
    } else {
      emitter.emit('access', path)
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

### new DeepProxy(target, handlers, [options])

Identical to `new Proxy(target, handlers)`, except that the callbacks provided
in the `traps` object will be called wiith a `this`-context that has some
additional properties. For a full reference on what arguments are provided to
the handlers, please consult the a
[MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler).

`options` is an object that can contain the following entries:

 - **path** either a string denoting the full path to the object or an array or property keys

### context.rootTarget

A reference to the object with wich the nested proxy was created.

### context.path

Holds the full property path to the given object.

### context.nest([nestedTarget])

Returns a new proxy that will trap methods as described in this API.
`nestedTarget` is an optional object with which the proxy will be initialized.

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

Copyright 2017 Sam Vervaeck

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

