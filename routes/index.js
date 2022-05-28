var express = require('express');
var router = express.Router();


const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://wqpjzzmbpslxva:7d9f93f6ae60be3334e9984c66ca565748e20224eac1d772cec1a4af3c20d8d0@ec2-52-30-67-143.eu-west-1.compute.amazonaws.com:5432/dek79mk06tp5is',
  ssl: {
    rejectUnauthorized: false
  }
});

// client.connect();
// let data = new Array();

// client.query('SELECT * FROM public.users;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     data.push(row);
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'YogaLand'});
});


router.get('/show_data', function(req, res, next) {

  client.connect();
  const data = client.query('SELECT * FROM public.users', (err, res) => {
    if (err) throw err;
    console.log(data);
  })
  client.end();
})

module.exports = router;
