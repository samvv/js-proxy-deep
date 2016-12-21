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
      const chunks = _.toPath(path)
      const key = chunks[chunks.length-1]
      chunks.pop()
      return [chunks.join('.'), key]
    }

    _.defaults(traps, {
      get(oTarget, sPath, next) {
        return _.get(oTarget, sPath)
      },
      set(oTarget, sPath, vValue) {
        _.set(oTarget, sPath, vValue)
      },
      deleteProperty(oTarget, sPath) {
        _.unset(oTarget, sPath)
      },
      has(oTarget, sPath) {
        return _.has(oTarget, sPath)
      },
      defineProperty(oTarget, sPath, oDesc) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.defineProperty(get(oTarget, sParentPath), sKey, oDesc)
      },
      getOwnPropertyDescriptor(oTarget, sPath) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.getOwnPropertyDescriptor(get(oTarget, sParentPath), sKey)
      }
    })

		this.proxy = new Proxy(target, {
      getPrototypeOf: traps.getPrototypeOf,
      setPrototypeOf: traps.setPrototypeOf,
      isExtensible: traps.isExtensible,
      preventExtensions: traps.preventExtensions,
      apply: traps.apply,
      construct: traps.construct,
      ownKeys: traps.ownKeys,
			get: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.get(this.root, newPath.join('.'), () => new Node({}, traps, newPath, this.root).proxy)
			},
			set: (oTarget, sKey, vValue) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.set(this.root, newPath.join('.'))
			},
			deleteProperty: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.deleteProperty(this.root, newPath.join('.'))
			},
			enumerate: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.enumerate(this.root, newPath.join('.'))
			},
			has: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.has(this.root, newPath.join('.'))
			},
			defineProperty: (oTarget, sKey, oDesc) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
				return traps.defineProperty(this.root, newPath.join('.'), oDesc)
			},
			getOwnPropertyDescriptor: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.getOwnPropertyDescriptor(this.root, newPath.join('.'))
			}
		})

	}

}

module.exports = function (target, traps) {
  return new Node(target, traps).proxy
}
