var express = require('express');
var router = express.Router();
const { Client } = require('pg');
let client;

//connect to db
function createClient() {
  client = new Client({
    connectionString: 'postgres://tbfnnuirlbjgnp:1fba8e67df7a5cd9db62a91904e224de773d0deaeed315be1c29bee90e6b84ca@ec2-34-242-84-130.eu-west-1.compute.amazonaws.com:5432/d9cf4rej73i41r',
    ssl: { rejectUnauthorized: false }
  })
}

/* GET users  */
router.get('/test', function (req, res, next) {
  function get_users() {
    createClient();
    client.connect();
    client.query("SELECT * FROM public.users", function (err, result){
      if (err) throw err;
      let data = JSON.stringify(result.rows);
      console.log(data);
      client.end();
      res.send(data);
    });
  }
  get_users();
});

module.exports = router;
