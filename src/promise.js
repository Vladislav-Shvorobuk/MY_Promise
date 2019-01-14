/*eslint-disable*/
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class OwnPromise {
  constructor(executor) {

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.status = PENDING;
    
    if (typeof executor !== 'function') {
      throw new TypeError('Not a function');
    }

const resolve = res => {
      if (res instanceof OwnPromise) {
        res.then(resolve);
      }

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
        this.error = error;
        setTimeout(() => {
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
    // if (!(this instanceof OwnPromise)) {
    //   throw new TypeError('Not a function');
    // }

    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =  typeof onRejected === "function" ? onRejected : error => { error; };

    return new this.constructor((resolve, reject) => {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          const resCallback = onFulfilled(this.value);
          OwnPromise.checkFunction(resCallback, resolve, reject);
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          const resCallback = onRejected(this.error);
          OwnPromise.checkFunction(resCallback, resolve, reject);
        }, 0);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(value => {
          try {
            const resCallback = onFulfilled(value);
            OwnPromise.checkFunction(resCallback, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedCallbacks.push(error => {
          // try {
            const resCallback = onRejected(error);
            OwnPromise.checkFunction(resCallback, resolve, reject);
          // } catch (error) {
          //   reject(error);
          // }
        });
      }
    });
  }

// CHECK_FUNCTION
  static checkFunction(result, resolve, reject) {
    if (typeof resolve !== 'function' || typeof reject !== 'function') {
      throw new TypeError('Not a function');
    }

    try {
      if (result instanceof OwnPromise){
        result.then(a => resolve(a));
      }else {
        resolve(result);
      }
    } catch (e){
      reject(e);
    }

    if (result instanceof OwnPromise){
      result.then(a => reject(a));
    }else {
      reject(result);
    }


    // let called = false;

    // if (result instanceof OwnPromise) {
    //   try {
    //     let then = result.then;
    //     if (typeof then === "function") {
    //       then.call(
    //         x,
    //         y => {
    //           if (called) return;
    //           called = true;
    //           checkFunction(y, resolve, reject);
    //         },
    //         error => {
    //           if (called) return;
    //           called = true;
    //           reject(error);
    //         }
    //       );
    //     } else {
    //       resolve(result);
    //     }
    //   } catch (e) {
    //     if (called) return;
    //     called = true;
    //     reject(e);
    //   }
    // } else {
    //   resolve(result);
    // }
  }

  // CATCH
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(fn) {
    return this.then(res => OwnPromise.resolve(fn()).then(() => res), err => OwnPromise.reject(fn()).then(() => err));
  }

  // ALL
  static all(promises) {
    if(typeof this !== 'function'){
      throw TypeError('this !== function');
    }

    if(promises.length == undefined ){
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Not an itterable'));
      });
    }

    if(promises.length == 0 ){
      return new OwnPromise((resolve, reject) => {
        resolve([]);
      });
    }



    return new this((resolve, reject) => {
      let result = [];
      let count = 0;
      for (let i = 0; i < promises.length; i++) {
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
    if (typeof this !== 'function') {
      throw new TypeError('this is not a constructor');
    }

    if(promises == [] ){
      return new OwnPromise((resolve, reject) => {
      });
    }
    
    if(promises.length == undefined ){
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

  static resolve(value) {
    if (value instanceof OwnPromise) {
      return value;
    }
    return new this(function(resolve, reject) {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }
      resolve(value);
    });
  }

  static reject(error) {
    return new this((resolve, reject) => {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }
      reject(error);
    });
  }
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