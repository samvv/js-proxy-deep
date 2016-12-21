
This is a library which enables users to "trap" deeply nested objects into
[proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
The API is identical to the proxy API, except that keys are now paths in the
object.

The most simple example imaginable:

```js
const proxyDeep = require('proxy-deep')

const o = proxyDeep({{}, {
  get(target, path, nest) {
    if (path[path.length-1] === 'path')
      return 'foo everywhere!'
    else
      return nest()
  }
})

o.hey.this.is.a.random.path // foo everywhere!
o.hey.whats.this // object
```

## Limitations

Currently, only `get` and `set` traps are implemented.

