class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Executor is not a function');
    }

    this.state = 'PENDING';
    this.value = null;
    this.queue = [];
    executor(OwnPromise.resolve, OwnPromise.reject);
  }

  static resolve(value) {
    if (this.state !== 'PENDING') {
      return undefined;
    }
    this.state = 'FULFILLED';
    return value && ({}).hasOwnProperty.call(value, 'then') ? value
      : new OwnPromise(resolve => {
        resolve(value);
      });
  }

  // static all() {

  // }
  // static race() {

  // }
  //   static resolve(value) {
  //     return new OwnPromise(resolve => resolve(value));
  //   }

  then(onFulfilled, onRejected) {
    if (this.state === 'FULFILLED') {
      return new OwnPromise(onFulfilled => onFulfilled(this.value));
    }

    if (this.state === 'REJECTED') {
      return new OwnPromise(onRejected => onRejected(this.value));
    }
  }

  // catch() {
  // }
  // finally() {
  // }
  // get [Symbol.toStringTag]() {
  //   return this.name;
  // }
}

module.exports = OwnPromise;
