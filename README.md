
This is a library which enables users to "trap" deeply nested objects into
[proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
The API is identical to the proxy API, except that keys are now paths in the
object.

The most simple example imaginable:

```js
const o = new DeepProxy(null, {
  get(target, path) {
    return 'foo everywhere!'
  }
})

o.hey.this.is.a.random.path // foo everywhere!
```

## Limitations

Currently, only `get` and `set` traps are implemented.

