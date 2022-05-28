var express = require('express');
var router = express.Router();

const { Client } = require('pg');
// const { response } = require('../app');
let client;

function createClient() {
  client = new Client({
    connectionString: 'postgres://wqpjzzmbpslxva:7d9f93f6ae60be3334e9984c66ca565748e20224eac1d772cec1a4af3c20d8d0@ec2-52-30-67-143.eu-west-1.compute.amazonaws.com:5432/dek79mk06tp5is',
    ssl: { rejectUnauthorized: false }
  })
}


/* GET users listing. */
router.get('/test', function (req, res, next) {
  // res.send("users main page");

  // let rows = [];
  function get_users() {
    createClient();
    client.connect();
    client.query("SELECT * FROM public.users", function (err, result){
      if (err) throw err;


      let data = JSON.stringify(result.rows);
      console.log(data);
      // rows = rows.push(data);
      client.end();
      // console.log("rows: ", rows);
      res.send(data);
    });
  }
  get_users();


  // res.send('respond with a resource');
});

module.exports = router;
