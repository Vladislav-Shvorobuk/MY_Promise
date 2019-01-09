class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Executor is not a function');
    }

    this.state = 'PENDING';
    this.queue = [];

    const _resolve = res => {
      this.state = 'FULFILLED';
      setTimeout(res => {
        for (const task of this.queue) {
          const func = task.resolve;
          func(res);
        }
        this.queue = [];
      }, 0);
    };

    const _reject = res => {
      this.state = 'REJECTED';
      setTimeout(res => {
        for (const task of this.queue) {
          const func = task.reject;
          func(res);
        }
        this.queue = [];
      }, 0);
    };

    try {
      executor(_resolve, _reject);
    } catch (error) {
      _reject(error);
    }
    return this;
  }

  static next({ onFulfilled, onRejected }) {
    if (this.state === 'PENDING') {
      this.dat.push({ resolve: onFulfilled, reject: onRejected });
      return;
    }

    if (this.state === 'FULFILLED') {
      onFulfilled(this.data);
    } else {
      onRejected(this.data);
    }
  }

  then(onFulfilled, onRejected) {
    const next = OwnPromise.next.bind(this);

    return new OwnPromise((resolve, reject) => {
      next({
        onFulfilled: res => {
          const result = onFulfilled(res);
          resolve(result);
        },
        onRejected: err => {
          const error = onRejected(err);
          reject(error);
        }
      });
    });
  }

  static resolve(value) {
    this.state = 'FULFILLED';

    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }

    return new OwnPromise((resolve, reject) => {
      if (!(this instanceof OwnPromise)) {
        throw new TypeError('must be instance of Promise.');
      }

      if (value instanceof OwnPromise) {
        return value;
      }

      if (value && value.then && typeof value.then === 'function') {
        return new OwnPromise(value.then);
      }
      resolve(value);
    });
  }

  static reject(reason) {
    this.state = 'REJECTED';

    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }
    return new OwnPromise((resolve, reject) => {
      if (reason instanceof OwnPromise) {
        return reason;
      }

      if (reason.then && typeof reason.then === 'function') {
        return new OwnPromise(reason.then);
      }
      reject(reason);
    });
  }

  static all(promises) {
    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }

    // if ((!Array.isArray(promises))) {
    //   throw new TypeError('Promise.all arguments must be an array.');
    // }
    const results = [];

    return new OwnPromise((resolve, reject) => {
      promises.forEach((promise, i) => {
        promise.then(res => {
          results[i] = res;

          if (results.length === promises.length) {
            resolve(results);
          }
        }, err => {
          reject(err);
        });
      });
    });
  }

  static race(iterable) {
    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }
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


  // then(onFulfilled, onRejected) {
  //   if (this.state === 'FULFILLED') {
  //     return new OwnPromise(onFulfilled => onFulfilled(this.value));
  //   }

  //   if (this.state === 'REJECTED') {
  //     return new OwnPromise(onRejected => onRejected(this.value));
  //   }
  // }

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