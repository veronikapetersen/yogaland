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


router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'YogaLand' });
});


// GET index page
router.get('/index', function (req, res, next) {
  //  initialize session:
  let session = req.session;
  if (req.session.loggedin) {
    let data = session.result;
    res.render('index', { title: 'YogaLand', name: data.rows[0].user_first_name });
  } else {
    res.redirect('/');
  }
});


router.get('/logout', function (req, res, next) {
  req.session.loggedin = false;
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/')
  });
})


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






// POST routes
router.post('/login', function (req, res, next) {
  createClient();
  let useremail = req.body.useremail;
  let password = req.body.password;
  if (useremail && password) {
    client.connect();
    client.query("SELECT * FROM public.users WHERE user_email = $1 AND user_pw = $2",
      [useremail, password], function (err, result) {
        if (err) throw err;
        if (result.rows.length > 0) {
          // initialize session
          let session = req.session;
          req.session.loggedin = true;
          session.result = result;
          res.redirect('/index');
          client.end();
        }
        else {
          client.end();
        }
      });
  }
});



router.post('/signup', function (req, res, next) {
  createClient();
  let signup_useremail = req.body.signup_useremail;
  let signup_password = req.body.password;
  let signup_first_name = req.body.first_name;
  let signup_last_name = req.body.last_name;
  let signup_street = req.body.street;
  let signup_building = req.body.building;
  let signup_zipcode = req.body.zipcode;

  console.log("email:", signup_useremail, "pw:", signup_password,
    "first name:", signup_first_name, "last name:", signup_last_name,
    "address:", signup_street, signup_building, "zipcode:", signup_zipcode);

    if (signup_useremail && signup_password && signup_first_name && signup_last_name && signup_street && signup_building && signup_zipcode) {
      client.connect();
      client.query("INSERT INTO public.users (user_email, user_pw, user_first_name, user_last_name, user_street, user_building, user_zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [signup_useremail, signup_password, signup_first_name, signup_last_name, signup_street, signup_building, signup_zipcode], function (err, result) {
        if (err) throw err;
        if (result.rowCount.length > 0) {
          res.send("user created!");
          client.end();
          console.log("user added");
        }
      }) 
    }
});

module.exports = router;
