var express = require('express');
const session = require('express-session');
var router = express.Router();
const { Client } = require('pg');
let client;

// Connect to db
function createClient() {
  client = new Client({
    connectionString: 'postgres://tbfnnuirlbjgnp:1fba8e67df7a5cd9db62a91904e224de773d0deaeed315be1c29bee90e6b84ca@ec2-34-242-84-130.eu-west-1.compute.amazonaws.com:5432/d9cf4rej73i41r',
    ssl: { rejectUnauthorized: false }
  })
}



// GET login page.
router.get('/', function (req, res, next) {
  res.render('login', { title: 'YogaLand' });
});


// GET index page
router.get('/index', function (req, res, next) {
  console.log("rendering index page");
  //  initialize session:
  let session = req.session;
  if (req.session.loggedin){
    console.log("logged in");
    let data = session.result;
    res.render('index', { title: 'YogaLand', name: data.rows[0].user_first_name});
  }else{
    res.render('/');
  }
});


router.get('/logout', function (req, res, next) {
  req.session.loggedin = false;
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/')
  });
})


// POST routes
router.post('/login', function (req, res, next) {
  createClient();
  let useremail = req.body.useremail;
  let password = req.body.password;
  console.log(useremail, password);
  if (useremail && password) {
    client.connect();
    client.query("SELECT * FROM public.users WHERE user_email = $1 AND user_pw = $2",
      [useremail, password], function (err, result) {
        if (err) throw err;
        console.log("length: ", result.rows.length);
        if (result.rows.length > 0) {
          // initialize session
          let session = req.session;
          req.session.loggedin = true;
          session.result = result;
          console.log(session.result);
          res.redirect('/index');
          client.end();
        }
        else {
          console.log("no user found");
          client.end();
        }
      });
  }
});



router.get('/show_data', function (req, res, next) {
  createClient();
  client.connect();
  client.query('SELECT * FROM public.users', (err, result) => {
    if (err) throw err;
    let data = JSON.stringify(result.rows);
    client.end();
    res.send(data);
  })
})

module.exports = router;
