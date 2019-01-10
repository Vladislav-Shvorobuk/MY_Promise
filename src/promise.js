/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

let cb = null;

class OwnPromise {
  constructor(exeq) {
    this.state = PENDING;
    this.callbacks = [];

   const resolve = (data) => {
      if(this.state !== PENDING){
        return;
      }
      this.state === RESOLVED;
      this.value = data;
      this.callbacks.forEach(({res, rej}) => {
        //нужна проверка
        this.value = res(this.value);
      });
   }
   const reject = (error) => {

   }

   try {
    exeq(resolve, reject);
   } catch (e){
     reject(e);
   }



  }

  // вынести логику 

  then(res, rej) {
    // cb = res;
    if(this.state == RESOLVED){
      res(this.value);
    }
    this.callbacks.push({res, rej});
    return this; //новый инстенс своего промиса
  }
  catch(rej) {

  }
}

module.exports = OwnPromise;

new Promise(function(resolve, reject) {
  setTimeout(() => {
    resolve(1);
  });
});