var express = require('express');
const session = require('express-session');
var router = express.Router();
// const bcrypt = require('bcrypt');


const { Client } = require('pg');
let client;
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

router.get('/instructor', function (req, res, next) {
  res.render('instructor', { title: 'YogaLand' });
});

router.get('/home_instructor', function (req, res, next) {
  res.render('home_instructor', { title: 'YogaLand', whoami: ': Instructors' });
});


// GET index page
router.get('/index', function (req, res, next) {
  // for testing purposes - render home page without being logged in
  res.render('index', { title: 'YogaLand' });
  //  initialize session:
  // // // let session = req.session;
  // // // if (req.session.loggedin) {
  // // //   let data = session.result;
  // // //   res.render('index', { title: 'YogaLand', name: data.rows[0].user_first_name });
  // // // } else {
  // // //   res.redirect('/');
  // // // }
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
    res.json(data);
    // return res.send(data)
  })
})


router.get('/class/id/:id', function (req, res, next) {
  createClient();
  client.connect();
  // req.singleObject;
  client.query('SELECT * FROM public.classes WHERE class_id = $1', [req.params.id],  (err, result) => {
    if (err) throw err;
    // let data = JSON.stringify(result.rows);
    let data = result.rows[0];
    // res.json(data);
    client.end();
    // return res.send(true);
    res.render('single_class', { title: 'YogaLand', data: data});
    // return res.send(data)
  })
})


// router.get('/classes', function (req, res, next) {
//   createClient();
//   client.connect();
//   client.query('SELECT * FROM public.classes', (err, result) => {
//     if (err) throw err;
//     let data = JSON.stringify(result.rows);
//     client.end();
//     res.json(data);
//     // return res.send(data)
//   })
// })

router.get(`/index/classes/*`, function (req, res, next) {

  let query = req.query;
  // let body = req.body;
  // let params = req.params;
  // console.log("query: ", query, "body: ", body, "params: ", params);
  console.log("query: ", query);
  let count = 0;
  let where = 'WHERE ';
  let paramsArray = [];

  for (const key in query) {
    // console.log(`${key}: ${query[key]}`);

    if (Array.isArray(query[key])) {
      query[key].forEach(x => {
        paramsArray.push(x);
        if (count > 0) {
          where += ' OR '
        }
        where += `classes.` + key + `=$` + ++count;
      });
    }else{
      paramsArray.push(query[key]);
      if (count > 0) {
        where += ' OR '
      }
      where += `classes.` + key + `=$` + ++count;
    }

  }

  console.log("params array:", paramsArray);
  createClient();
  client.connect();
  // let sql = 'SELECT * FROM public.classes JOIN public.instructors on classes.instructor_id = instructors.instructor_id JOIN public.locations on classes.location_id = locations.location_id ' + where;
  // console.log(sql);
  // client.query('SELECT * FROM public.classes ' + where, paramsArray, (err, result) => {
  client.query('SELECT * FROM public.classes JOIN public.instructors on classes.instructor_id = instructors.instructor_id JOIN public.locations on classes.location_id = locations.location_id ' + where, paramsArray, (err, result) => {
    
if (err) throw err;
    let data = JSON.stringify(result.rows);
    client.end();
    res.json(data);
    // console.log(data);
    // return res.send(data)
  })
  // return res.send(true);
})

// POST routes
router.post('/login', function (req, res, next) {
  createClient();
  let useremail = req.body.useremail;
  let password = req.body.password;
  let instructor = req.body.instructor_login;
  if (useremail && password) {
    client.connect();
    let sql;
    if (instructor) {
      sql = "SELECT * FROM public.instructors WHERE instructor_email = $1 AND instructor_pw = $2"
    } else {
      sql = "SELECT * FROM public.users WHERE user_email = $1 AND user_pw = $2"
    }
    client.query(sql, [useremail, password], function (err, result) {
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
        console.log("user not found");
        client.end();
        // store the error message 
        // pass it to the frontend with the request response method inside a function
        // look up the example in html banners tool
        document.querySelector("#error_msg").innerHTML = "wrong credentials";
        // res.render('/', { error_message: 'wrong credentials'});
      }
    });
  }
});

router.post('/signup', function (req, res, next) {
  createClient();
  let signup_useremail = req.body.signup_useremail;
  
  const saltRounds = 10;
  // const salt = bcrypt.genSaltSync(saltRounds);

  let signup_password = req.body.password;
  let signup_first_name = req.body.first_name;
  let signup_last_name = req.body.last_name;
  let signup_street = req.body.street;
  let signup_building = req.body.building;
  let signup_zipcode = req.body.zipcode;
  let instructor = req.body.instructor_signup;

  if (signup_useremail && signup_password && signup_first_name && signup_last_name && signup_street && signup_building && signup_zipcode) {
    client.connect();
    let sql;
    if (instructor) {
      sql = "INSERT INTO public.instructors (instructor_email, instructor_pw, instructor_first_name, instructor_last_name, instructor_street, instructor_building, instructor_zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    } else {
      sql = "INSERT INTO public.users (user_email, user_pw, user_first_name, user_last_name, user_street, user_building, user_zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    }
    client.query(sql, [signup_useremail, signup_password, signup_first_name, signup_last_name, signup_street, signup_building, signup_zipcode], function (err, result) {
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
