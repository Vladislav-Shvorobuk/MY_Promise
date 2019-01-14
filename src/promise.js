/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(exeq) {
    this.state = PENDING;
    this.callbacks = [];

    if(typeof exeq !== 'function'){
      throw TypeError('');
    }

    const resolve = (data) => {
      if (this.state !== PENDING) {
        return;
      }

      this.state = RESOLVED;

      if (data instanceof OwnPromise) {
        data.then(a => this.value = a);
      }

      this.value = data;
      this.callbacks.forEach(({ res, rej }) => {
        this.value = res(this.value);
      });
    }

    const reject = (error) => {
      if (this.state !== PENDING) {
        return;
      }

      this.state = REJECTED;

      // if (error instanceof OwnPromise) {
      //   error.then(a => this.value = a);
      // }

      this.value = error;
      this.callbacks.forEach(({ res, rej }) => {
        this.value = rej(error);
      });
    }

    try {
      exeq(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === PENDING) {
      // setTimeout(() => {
        this.callbacks.push({ res: onFulfilled, rej: onRejected });
      // }, 0);
      return new OwnPromise((resolve, reject) => {
        resolve(onFulfilled(this.value));
        reject(onFulfilled(this.value));
      });
    }

    this.callbacks.push({ onFulfilled, onRejected });

    return new OwnPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(onFulfilled(this.value));
      }, 0);
      setTimeout(() => {
        reject(onFulfilled(this.value));
      }, 0);
    });
  }

  static resolve(value) {
    if (value && typeof value === 'object') {
      return value;
    }

    return new this((resolve, reject) => {
      if (typeof resolve !== 'function' || reject != 'function') {
        throw new TypeError('Not a function');
      }

      try {
        resolve(value);
      } catch (err) {
        reject(res);
      }
    });
  }


  static reject(reason) {
    if (typeof this !== 'function') {
      throw new TypeError('this is not a function');
    }

    return new OwnPromise((resolve, reject) => {
      if (typeof reject !== 'function') {
        throw new TypeError('Not a function');
      }
      reject(reason);
    });
  };

  static all(promises) {

    if (promises.length == undefined) {
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Promises are\'t iterable'));
      });
    }

    if (typeof this !== 'function') {
      throw new TypeError('Not a function');
    }

    if (promises.length == 0) {
      return new OwnPromise((resolve, reject) => {
        resolve([]);
      });
    }

    return new OwnPromise((resolve, reject) => {
      let result = [];

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          data => {
            result[i] = data;
            if (result.length === promises.length) {
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

  static race(promises) {
    if (typeof this !== 'function') {
      throw new TypeError('');
    }

    if (promises == []) {
      return new OwnPromise((resolve, reject) => {
      });
    }

    if (promises.length == undefined) {
      return new OwnPromise((resolve, reject) => {
        reject(new TypeError('Not an itterable'));
      });
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


  catch(onRejected) {
    return this.then(onRejected);
  }
}

module.exports = OwnPromise;









const p = new OwnPromise(function (resolve, reject) {
  setTimeout(() => {
    console.log('resolve');
    resolve('value');
  }, 1000);
});


p.then((v) => {
  console.log(v, 'first then 1');
  return 'then'
}).then((v) => {
  console.log(v, 'second after first then 4');
  return 'then'
});

p.then((v) => {
  console.log(v, 'first independed then 2');
  return 'then'
});
p.then((v) => {
  console.log(v, 'second independed then 3')
  return 'then'
});








/* 
let p = new Promise((resolve, reject) => {
  resolve(0);
})  // undefined
p // Promise {<resolved>: 0}
      // __proto__: Promise
      // [[PromiseStatus]]: "resolved"
      // [[PromiseValue]]: 0
p.then((value) =>{
    return value + 1;
});  //Promise {<resolved>: 1}


p.then((value) =>{
  return value + 1;
}).then((value) =>{
  return value + 1;
}); //Promise {<resolved>: 2}
 */



 /* 
let p = new OwnPromise((resolve, reject) => {
  resolve(0);
})  // undefined
p // Promise {<resolved>: 0}
      // __proto__: Promise
      // [[PromiseStatus]]: "resolved"
      // [[PromiseValue]]: 0
p.then((value) =>{
    return value + 1;
});  //Promise {<resolved>: 1}


p.then((value) =>{
  return value + 1;
}).then((value) =>{
  return value + 1;
}); //Promise {<resolved>: 2}
 */



// let p = new OwnPromise((resolve, reject) => {
//   resolve(0);
// });
// p.then((value) =>{
//   return value + 1;
// }).then((value) =>{
//   return value + 1;
// });






























  // then(onFulfilled, onRejected) {
  //   // cb = res;
  //   if(this.state === PENDING){
  //     this.callbacks.push({ resolve: onFulfilled, reject: onRejected });
  //     // onFulfilled(this.value);
  //     return this;
  //   }

  //   this.callbacks.push({ resolve: onFulfilled, reject: onRejected });

  //   return new OwnPromise((resolve, reject) => {

  //     // try {
  //       conFulfilling(resolve);
  //     // } catch (err) {
  //     //   const res = onRejected(err);
  //     //   reject(res);
  //     // }
  //   });
  // }

  // onFulfilling(resolve) {
  //   resolve(this.value);
  // }