
// Many thanks to @serkanyersen on GitHub for these definitions
// https://github.com/samvv/js-proxy-deep/issues/7

declare namespace DeepProxy {

  export interface DeepProxyHandler<T extends object> {
    getPrototypeOf? (this: TrapThisArgument<T>, target: T): object | null;
    setPrototypeOf? (this: TrapThisArgument<T>, target: T, v: any): boolean;
    isExtensible? (this: TrapThisArgument<T>, target: T): boolean;
    preventExtensions? (this: TrapThisArgument<T>, target: T): boolean;
    getOwnPropertyDescriptor? (this: TrapThisArgument<T>, target: T, p: PropertyKey): PropertyDescriptor | undefined;
    has? (this: TrapThisArgument<T>, target: T, p: PropertyKey): boolean;
    get? (this: TrapThisArgument<T>, target: T, p: PropertyKey, receiver: any): any;
    set? (this: TrapThisArgument<T>, target: T, p: PropertyKey, value: any, receiver: any): boolean;
    deleteProperty? (this: TrapThisArgument<T>, target: T, p: PropertyKey): boolean;
    defineProperty? (this: TrapThisArgument<T>, target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean;
    enumerate? (this: TrapThisArgument<T>, target: T): PropertyKey[];
    ownKeys? (this: TrapThisArgument<T>, target: T): PropertyKey[];
    apply? (this: TrapThisArgument<T>, target: T, thisArg: any, argArray?: any): any;
    construct? (this: TrapThisArgument<T>, target: T, argArray: any, newTarget?: any): object;
  }

  export interface TrapThisArgument<T extends object> {
    nest(value?: any): object;
    path: string[];
    rootTarget: T; 
  }

  export interface DeepProxyConstructor {
    revocable<T extends object>(target: T, handler: DeepProxyHandler<T>): { proxy: T; revoke: () => void; };
    new <T extends object>(target: T, handler: DeepProxyHandler<T>): T;
  }

}

declare var pd: DeepProxy.DeepProxyConstructor;
export = pd;

