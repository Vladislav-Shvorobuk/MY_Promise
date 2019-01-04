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
    this.state = 'FULFILLED';
    this.value = value;
    return value && ({}).hasOwnProperty.call(value, 'then') ? value
      : new OwnPromise(resolve => {
        resolve(value);
      });
  }

  static reject(reason) {
    this.state = 'REJECTED';
    this.value = reason;
    return new OwnPromise((_, reject) => reject(reason));
  }

  // static all() {

  // }
  static race(iterable) {
    return new OwnPromise((resolve, reject) => {
      iterable.forEach((item, i) => {
        if (!(item instanceof OwnPromise)) {
          throw new TypeError('inner argument must be an instance of Promise.');
        }
        item.then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
      });
    });
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'FULFILLED') {
      return new OwnPromise(onFulfilled => onFulfilled(this.value));
    }

    if (this.state === 'REJECTED') {
      return new OwnPromise(onRejected => onRejected(this.value));
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(fn) {
    return this.then(res => OwnPromise.resolve(fn()).then(() => res), err => OwnPromise.reject(fn()).then(() => err));
  }
  // get [Symbol.toStringTag]() {
  //   return this.name;
  // }
}

module.exports = OwnPromise;
