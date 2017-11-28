'use strict';

const getDeep = require('lodash/get');
const toPath = require('lodash/toPath');
const defaults = require('lodash/defaults');
const clone = require('lodash/clone');
const isObjectLike = require('lodash/isObjectLike');

function get(obj, path) {
  if (!path)
    return obj;
  return getDeep(obj, path);
}

function push(arr, el) {
  const newArr = arr.slice();
  newArr.push(el);
  return newArr;
}

function pathPop(path) {
  const parentPath = clone(path);
  const key = parentPath[parentPath.length-1];
  parentPath.pop();
  return [parentPath, key];
}

// names of the traps that can be registered with ES6's Proxy object
const trapNames = [
  'getPrototypeOf',
  'setPrototypeOf',
  'isExtensible',
  'preventExtensions',
  'construct',
  'ownKeys',
  'get',
  'set',
  'deleteProperty',
  'enumerate',
  'has',
  'defineProperty',
  'getOwnPropertyDescriptor',
  'apply',
]

// a list of paramer indexes that indicate that the a recieves a key at that parameter
// this information will be used to update the path accordingly
const keys = {
  get: 1,
  set: 1,
  deleteProperty: 1,
  enumerate: 1,
  has: 1,
  defineProperty: 1,
  getOwnPropertyDescriptor: 1,
}

function DeepProxy(rootTarget, traps, options) {

  function createProxy(target, path) {
    
    // avoid creating a new object between two traps
    const context = { rootTarget, path };

    const realTraps = {};

    for (const trapName of trapNames) {
      const keyParamIdx = keys[trapName]
          , trap = traps[trapName];

      if (typeof trap !== 'undefined') {

        if (typeof keyParamIdx !== 'undefined') {

          realTraps[trapName] = function () {

            const key = arguments[keyParamIdx];

            // update context for this trap
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = {};
              return createProxy(nestedTarget, push(path, key)); 
            }

            return trap.apply(context, arguments);
          }
        } else {

          realTraps[trapName] = function () {

            // update context for this trap
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = {};
              return createProxy(nestedTarget, path);
            }

            return trap.apply(context, arguments);
          }
        }
      }
    }

    return new Proxy(target, realTraps);
  }

  return createProxy(rootTarget, options !== undefined && typeof options.path !== 'undefined' ? options.path : []);

}

module.exports = DeepProxy;
