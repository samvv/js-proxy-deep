'use strict';

const _ = require('lodash') 

class Node {

  constructor(target, traps, path, root) {

    this.path = path || []
    this.root = root || this

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
      ownKeys(oTarget, sPath) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.getOwnPropertyNames(_.get(oTarget, sParentPath), sKey)
      },
      defineProperty(oTarget, sPath, oDesc) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.defineProperty(_.get(oTarget, sParentPath), sKey, oDesc)
      },
      getOwnPropertyDescriptor(oTarget, sPath) {
        const [sParentPath, sKey] = pathPop(sPath)
        return Object.getOwnPropertyDescriptor(_.get(oTarget, sParentPath), sKey)
      }
    })

		this.proxy = new Proxy(target, {
			get: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.get(this.root, newPath, () => new Node({}, traps, newPath, this.root).proxy)
			},
			set: (oTarget, sKey, vValue) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.set(this.root, newPath)
			},
			deleteProperty: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.deleteProperty(this.root, newPath)
			},
			enumerate: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.enumerate(this.root, newPath)
			},
			ownKeys: (oTarget, sKey) => {
        const newPath = _.clone(this.path)
        newPath.push(sKey)
        return traps.ownKeys(this.root, newPath)
			},
			has: (oTarget, sKey) => {
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
			}
		})

	}

}

module.exports = function (target, traps) {
  return new Node(target, traps).proxy
}
