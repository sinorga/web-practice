'use strict';
function getPosts() {
  return new Promise(function(resolve){
    resolve([
      {id:1, title: 'hello java'},
      {id:2, title: 'hello ruby'},
    ]);
  });
}

function getPost(id) {
  return new Promise(function(resolve){
    resolve({id: id, title: 'hello java', authorId: '1'});
  });
}

function getAuthor(id){
  return new Promise(function(resolve){
    resolve({id: id, name: 'orga'});
  });
}

function* genGetAuthor(param) {
  let posts = yield getPosts();
  let post = yield getPost(posts[0].id);
  let author = yield getAuthor(post.authorId);
  console.log(author);
  return author;
}

function promiseLooper(gen){
  let iterator = gen();
  let looper = function(iter) {
    if(!iter.done){
      iter.value.then((data)=>{
        looper(iterator.next(data));
      });
    }
  }
  looper(iterator.next());
}

promiseLooper(genGetAuthor);
// let getAuthorName = genGetAuthor();
// getAuthorName.next().value.then((posts)=>{
//   getAuthorName.next(posts).value.then((post)=>{
//     getAuthorName.next(post).value.then((author)=>{
//       console.log(author.name);
//     });
//   });
// });


function async(makeGenerator){
  return function () {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result){
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value);
      // NOTE: need return result in generator.

      return Promise.resolve(result.value).then(function (res){
        return handle(generator.next(res));
      }, function (err){
        return handle(generator.throw(err));
      });
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  }
}

let asyncGetAuthor = async(genGetAuthor);

asyncGetAuthor(5).then((data)=>{
  console.log('hehe');
  console.log(data);
});
