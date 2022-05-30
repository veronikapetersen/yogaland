var express = require('express');
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


// GET home page.
router.get('/', function (req, res, next) {
  res.render('login', { title: 'YogaLand' });
});


router.get('/index', function (req, res, next) {
  res.render('index', { title: 'YogaLand' });
});




router.get('/show_data', function (req, res, next) {
  createClient();
  client.connect();
  client.query('SELECT * FROM public.users', (err, res) => {
    if (err) throw err;
    let data = JSON.stringify(res.rows);
    console.log(data);
  })
  client.end();
})


// POST routes
router.post('/login', function (req, res, next) {

  function login() {
    createClient();
    let useremail = req.body.useremail;
    let password = req.body.password;
    client.connect(function (err) {
      client.query("SELECT * FROM public.users WHERE user_email = $1 AND user_pw = $2", [useremail, password], function (err, result) {
        if (err) throw err;
        let data = JSON.stringify(result.rows);
        console.log(data);
        res.send(data);
      });
    });
    client.end();
  };

  login();
});

// if (error) throw error;

// 		if (results.length > 0) {
// 			request.session.loggedin = true;
// 			request.session.useremail = useremail;
// 			// response.redirect('/index');
//       console.log("hey");
// 		} else {
// 			response.send('Incorrect Username and/or Password!');
// 		}			
// 		response.end();
// 	});
// } else {
// 	response.send('Please enter Username and Password!');
// 	response.end();
// }

// }
// )

module.exports = router;
