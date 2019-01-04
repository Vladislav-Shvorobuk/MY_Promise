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
  // static reject() {

  // }


  // then() {

  // }
  // catch() {
  // }
  // finally() {
  // }
  // get [Symbol.toStringTag]() {
  //   return this.name;
  // }
}

module.exports = OwnPromise;
