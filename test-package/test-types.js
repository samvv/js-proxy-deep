"use strict";
exports.__esModule = true;
//import { assert } from "chai"
var proxy_deep_1 = require("proxy-deep");
var db = new proxy_deep_1["default"]({}, {
    get: function (_target, _path, _receiver) {
        this.foo = 'bar';
        return this.nest();
    },
    apply: function (_target, _thisArg, _argList) {
        return this.path;
    }
});
//const result = db.select.from.where.whut();
//assert(result.length == 5)
//assert(result[0] == 'select')
//assert(result[1] == 'from')
//assert(result[2] == 'where')
//assert(result[3] == 'whut')
