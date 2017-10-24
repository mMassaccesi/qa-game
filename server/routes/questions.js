var express = require('express');
var router  = module.exports = express.Router();
var fs      = require('fs');

router.get('/', (req, res) => {
  fs.readFile('./server/questions.json', 'utf8', (err, data) => {
      if(err) console.log(err);
      getQuestions(JSON.parse(data), (q) => {
        res.send(q)
      });
  });
});


async function getQuestions(qq, cb){
  let questions = [];
  Object.keys(qq).map((k) => {
    qq[k].forEach((q) => {
      q.category = k;
      questions.push(q);
    })
  });

  let filteredQ = await getRandom(questions, process.env.QUANTITY || 5);
  cb(filteredQ);
}

function getRandom(arr, n){
    var ret = new Array(n),
        len = arr.length,
        taken = new Array(len);
    while (n--) {
        var x = Math.floor(Math.random() * len);
        ret[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return ret;
}
