const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Not a function');
    }

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.status = PENDING;

    const resolve = res => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = res;
        setTimeout(() => {
          this.onFulfilledCallbacks.forEach(callback => {
            callback(this.value);
          }, 0);
        });
      }
    };

    const reject = error => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.value = error;
        setTimeout(() => {
          this.onRejectedCallbacks.forEach(callback => {
            callback(this.value);
          }, 0);
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // THEN
  then(onFulfilled, onRejected) {
    const onFulf = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const onRej = typeof onRejected === 'function' ? onRejected : error => {
      error;
    };

    return new this.constructor(executor => {
      switch (this.status) {
      case FULFILLED:
        setTimeout(() => {
          executor(onFulf(this.value), null);
        }, 0);
        break;
      case REJECTED:
        setTimeout(() => {
          executor(null, onRej(this.value));
        }, 0);
        break;
      default:
        this.onFulfilledCallbacks.push(value => {
          executor(onFulf(value));
        });
        this.onRejectedCallbacks.push(error => {
          executor(onRej(error));
        });
      }
    });
  }

  // CATCH
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // FINALLY
  finally(fn) {
    return this.then(res => OwnPromise.resolve(fn()).then(() => res), err => OwnPromise.reject(fn()).then(() => err));
  }

  // RESOLVE
  static resolve(value) {
    if (value instanceof OwnPromise) {
      return value;
    }
    return new this((resolve, reject) => {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }
      resolve(value);
    });
  }

  // REJECT
  static reject(error) {
    return new this((resolve, reject) => {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }
      reject(error);
    });
  }

  // ALL
  static all(promises) {
    if (promises.length === 0) {
      return new this((resolve, reject) => {
        resolve([]);
      });
    }

    return new this((resolve, reject) => {
      const results = [];
      let count = 0;

      promises.forEach((promise, i) => {
        promise.then(res => {
          results[i] = res;
          count += 1;

          if (count === promises.length) {
            resolve(results);
          }
        }, err => {
          reject(err);
        });
      });
    });
  }

  // RACE
  static race(promises) {
    if (promises.length === undefined) {
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Not an itterable'));
      });
    }

    return new this((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}

module.exports = OwnPromise;


// const promise = new OwnPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(100);
//   }, 2000);
//   // resolve(100);
// });

// console.log(promise);

// promise
//   .then(function(value) {
//     console.log(`then =>${value}`);
//   }).then(() => 200);

// promise.then(function(value) {
//   console.log(`then =>${value}`);
//   return 300;
// })
//   .then(function(value) {
//     console.log(`then =>${value}`);
//     throw 'Я иду в catch';
//   })
//   .catch(function(value) {
//     console.log(`cath =>${value}`);
//     return 500;
//   })
//   .then(function(value) {
//     console.log(`then =>${value}`);
//     return 600;
//   })
//   .then(function(value) {
//     console.log(`then =>${value}`);
//     return 700;
//   });