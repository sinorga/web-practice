'use strict';
function* count(n) {
  for(let i=0;i<n;i++){
    yield i;
  }
}

let myIterate = count(5);
for(let obj of myIterate){
  console.log(obj);
}

myIterate = count(7);
let arr = [...myIterate];
console.log(arr);
