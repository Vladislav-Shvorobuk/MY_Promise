class OwnPromise {
  constructor(executor) {
    this.state = 'PENDING';
    this.value = null;
    this.queue = [];
    executor(OwnPromise.resolve, OwnPromise.reject);
  }

  // static all() {

  // }
  // static race() {

  // }
  // static resolve() {

  // }
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
