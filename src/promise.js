/*eslint-disable*/
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class OwnPromise {
  constructor(executor) {

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.status = PENDING;

    const resolve = res => {
      if (res instanceof OwnPromise) {
        res.then(resolve, reject);
      }
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED;
          this.value = res;
          this.onFulfilledCallbacks.forEach(callback => {
            callback(this.value);
          }, 0);
        });
      }
    };

    const reject = error => {
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = REJECTED;
          this.error = error;
          this.onRejectedCallbacks.forEach(callback => {
            callback(this.error);
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

    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : error => {
            throw error;
          };
  
    if (this.status === FULFILLED) {
      return new OwnPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let result = onFulfilled(this.value);
            OwnPromise.checkFunction(result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }
    if (this.status === REJECTED) {
      return new OwnPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.error);
            OwnPromise.checkFunction(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    }
    if (this.status === PENDING) {
      return new OwnPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push(value => {
          try {
            let x = onFulfilled(value);
            OwnPromise.checkFunction(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
  
        this.onRejectedCallbacks.push(error => {
          try {
            let x = onRejected(error);
            OwnPromise.checkFunction(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }

// CATCH
  catch(onRejected) {
    return this.then(null, onRejected);
  }

// CHECK_FUNCTION
  static checkFunction(result, resolve, reject) {
    if (result === new OwnPromise) {
      return reject(new TypeError("Circular reference"));
    };

    let called = false;

    if (result != null && (typeof result === "object" || typeof result === "function")) {
      try {
        let then = result.then;
        if (typeof then === "function") {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              checkFunction(y, resolve, reject);
            },
            error => {
              if (called) return;
              called = true;
              reject(error);
            }
          );
        } else {
          resolve(result);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(result);
    }
  }

  // ALL
  static all(promises) {

    if(promises.length == undefined ){
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Not an array'));
      });
    }
    if(typeof this !== 'function'){
         throw TypeError('typeof this !== function');
    }
    if(promises.length == 0 ){
      return new OwnPromise((resolve, reject) => {
        resolve([]);
      });
    }

    return new OwnPromise((resolve, reject) => {
      let result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
        if( !(promises[i] instanceof OwnPromise)) {
          throw TypeError('typeof this !== function');
        }
        promises[i].then(
          data => {
            result[i] = data;
            if (++count === promises.length) {
              resolve(result);
            }
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }

   // RACE
   static race(promises) {
    if(promises == [] ){
      return new OwnPromise((resolve, reject) => {
      });
    }
    if(promises.length == undefined ){
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Not an array'));
      });
    }

    if (typeof this !== 'function') {
      throw new TypeError('this is not a constructor');
    }
    return new OwnPromise((resolve, reject) => {
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

  // RESOLVE
  static resolve(value) {
    if (value && typeof value === 'object') {
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
    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }
    return new OwnPromise((resolve, reject) => {
      reject(error);
    });
  };
}

module.exports = OwnPromise;








const promise = new OwnPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 2000);
  // resolve(100);
});

console.log(promise);

promise
  .then(function(value) {
    console.log("then =>" + value);
  }).then(() => {
    return 200;
  })

  promise.then(function(value) {
    console.log("then =>" + value);
    return 300;
  })
  .then(function(value) {
    console.log("then =>" + value);
    throw "Я иду в catch";
  })
  .catch(function(value) {
    console.log("cath =>" + value);
    return 500;
  })
  .then(function(value) {
    console.log("then =>" + value);
    return 600;
  })
  .then(function(value) {
    console.log("then =>" + value);
    return 700;
  });