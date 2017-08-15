'use strict';

const _ = require('lodash') 

function get(obj, path) {
  if (!path)
    return obj
  return _.get(obj, path)
}

class Node {

  constructor(target, traps, path, root) {

    this.path = path || []
    this.root = root || target

    function pathPop(path) {
      const parentPath = _.clone(path)
      const key = path[path.length-1]
      parentPath.pop()
      return [parentPath, key]
    }

    _.defaults(traps, {
      get(oRoot, sPath, oReceiver, fNest) {
        const val = _.get(oRoot, sPath)
        console.log(typeof val)
        return (typeof val === 'object' || typeof val === 'function')
          ? fNest()
          : val
      },
      set(oRoot, sPath, vValue) {
        _.set(oRoot, sPath, vValue)
        return true
      },
      has(oRoot, sPath) {
        return _.has(oRoot, sPath)
      },
      deleteProperty(oRoot, sPath) {
        _.unset(oRoot, sPath)
      },
      enumerate: (oTarget, sPath) => {
        console.log(sPath)
      },
      getPrototypeOf(target, path) {
        return Object.getPrototypeOf(_.get(target, path))
      },
      setPrototypeOf(target, path) {
        return Object.setPrototypeOf(_.get(target, path))
      },
      isExtensible(target, path) {
        return Object.isExtensible(_.get(target, path))
      },
      preventExtensions(target, path) {
        return Object.preventExtensions(_.get(target, path))
      },
      defineProperty(oRoot, sPath, oTarget, oDesc) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.defineProperty(get(oRoot, sParentPath), sKey, oDesc)
      },
      getOwnPropertyDescriptor(oRoot, sPath) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.getOwnPropertyDescriptor(get(oRoot, sParentPath), sKey)
      },
      apply(oRoot, sPath, thisArg, argumentsList) {
        console.log('tere')
        const fn = _.get(oRoot, sPath)
        return Function.prototype.apply(thisArg, argumentsList)
      },
      construct(target, path, argumentsList, newTarget) {
        return Reflect.construct(_.get(target, path), argumentsList, newTarget)
      }
    })

		this.proxy = new Proxy(target, {
      getPrototypeOf: (target) => {
        return traps.getPrototypeOf(this.root, this.path, target)
      },
      setPrototypeOf: (target, prototype) => {
        return traps.setPrototypeOf(this.root, this.path, target, prototype)
      },
      isExtensible: (target) => {
        return traps.isExtensible(this.root, this.path, target)
      },
      preventExtensions: (target) => {
        return traps.preventExtensions(this.root, this.path, target)
      },
      construct: (target, argumentsList, newTarget) => {
        return traps.construct(this.root, this.path, target, argumentsList, newTarget)
      },
      ownKeys: (target) => {
        return traps.ownKeys(this.root, this.path, target)       
      },
			get: (oTarget, sKey, receiver) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.get(this.root, newPath, receiver, () => new Node({}, traps, newPath, this.root).proxy)
			},
			set: (oTarget, sKey, vValue, receiver) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.set(this.root, newPath, vValue, receiver)
			},
			deleteProperty: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.deleteProperty(this.root, newPath)
			},
			enumerate: (oTarget, sKey, reciever) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.enumerate(this.root, newPath)
			},
			has: (oTarget, sKey, reciever) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.has(this.root, newPath)
			},
			defineProperty: (oTarget, sKey, oDesc) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
				return traps.defineProperty(this.root, newPath, oDesc)
			},
			getOwnPropertyDescriptor: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.getOwnPropertyDescriptor(this.root, newPath)
			},
      apply: (target, thisArg, argumentsList) => {
        console.log('hre')
        return traps.apply(this.root, this.path, thisArg, argumentsList)
      }
		})

	}

}

module.exports = function (target, traps) {
  return new Node(target, traps).proxy
}
