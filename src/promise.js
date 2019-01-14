/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(exeq) {
    this.state = PENDING;
    this.callbacks = [];

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

    //  return this;
  }

  // вынести логику 

  then(onFulfilled, onRejected) {
    if (this.state === PENDING) {
      this.callbacks.push({ resolve: onFulfilled, reject: onRejected });
      return this;
    }

    this.callbacks.push({ resolve: onFulfilled, reject: onRejected });

    return new OwnPromise((resolve, reject) => {
      try {
        const res = onFulfilled(this.value);
        resolve(res);
      } catch (err) {
        const res = onRejected(err);
        reject(res);
      }
    });
  }

  catch(rej) {
    return this.then(rej);
  }
}

module.exports = OwnPromise;

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