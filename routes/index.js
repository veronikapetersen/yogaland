var express = require('express');
var session = require('express-session');
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



// GET
router.get('/', function (req, res, next) {
  res.render('login', { title: 'YogaLand' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'YogaLand' });
});

router.get('/home_instructor', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    res.render('home_instructor', { title: 'YogaLand', whoami: ': Instructors', data: data });
  } else {
    res.redirect('/');
  }
});

router.get('/index', function (req, res, next) {
  //  initialize session:
  let session = req.session;
  if (session.loggedin) {
    // let data = session.result;
    res.render('index', { title: 'YogaLand', data: data });
  } else {
    res.redirect('/');
  }
});


router.get('/logout', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    req.session.destroy(function (err) {
      if (err) throw err;
      res.redirect('/');
    });
  }
})


router.get('/users/:id/edit', function (req, res, next) {
  // let session = req.session;

  // if (session.loggedin) {
  createClient();
  client.connect();
  client.query('SELECT * FROM users WHERE users.user_id = $1', [req.params.id], (err, result) => {
    if (err) throw err;
    let data = result.rows[0];
    console.log(data);
    client.end();
    res.render('edit', { title: 'YogaLand', data: data });
  })

  // } else {
  //   res.redirect('/');
  // }

})












router.get('/class/:id', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    createClient();
    client.connect();
    client.query('SELECT * FROM public.classes  JOIN public.locations on locations.location_id = classes.location_id JOIN public.instructors on instructors.instructor_id = classes.instructor_id WHERE class_id = $1', [req.params.id], (err, result) => {
      if (err) throw err;
      let data = result.rows[0];
      console.log(data);
      client.end();
      res.render('single_class', { title: 'YogaLand', data: data });
    })
  } else {
    res.redirect('/');
  }
})


router.get('/instructor/:id', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    createClient();
    client.connect();
    //instructor information
    client.query('SELECT * FROM public.instructors JOIN public.reviews on instructors.instructor_id = reviews.instructor_id WHERE instructors.instructor_id = $1', [req.params.id], (err, result) => {
      if (err) throw err;
      let data = result.rows[0];
      //reviews for instructor
      client.query('SELECT * FROM public.reviews JOIN public.users on reviews.user_id = users.user_id WHERE reviews.instructor_id = $1', [req.params.id], (err, result) => {
        if (err) throw err;
        let datareviews = result.rows;
        //upcoming classes for instructor
        client.query('SELECT *, (SELECT COUNT(*) AS reservations FROM public.bookings WHERE bookings.class_id = classes.class_id) FROM public.classes JOIN public.locations on classes.location_id = locations.location_id WHERE classes.instructor_id = $1', [req.params.id], (err, result) => {
          if (err) throw err;
          let upcomingClasses = result.rows;
          client.end();
          res.render('instructor', {
            title: 'YogaLand',
            first_name: data.instructor_first_name,
            last_name: data.instructor_last_name,
            experience: data.instructor_experience,
            reviews: datareviews,
            upcomingClasses: upcomingClasses
          });
        });
      });
    })
  } else {
    res.redirect('/');
  }
});


router.get('/classes', function (req, res, next) {

  let session = req.session;
  if (session.loggedin) {
    createClient();
    client.connect();
    let sql = 'SELECT * , (SELECT COUNT(*) AS reservations FROM public.bookings AS b WHERE b.class_id = c.class_id) FROM public.classes as c '
      + 'JOIN public.instructors on c.instructor_id = instructors.instructor_id '
      + ' JOIN public.locations on c.location_id = locations.location_id '
      + ' ORDER BY class_date ASC ';
    client.query(sql, (err, result) => {
      if (err) throw err;
      let data = JSON.stringify(result.rows);
      client.end();
      res.json(data);
    });
  } else {
    res.redirect('/');
  }
});

router.get(`/index/classes/*`, function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    let query = req.query;
    console.log("query: ", query);
    let count = 0;
    let where = 'WHERE ';
    let paramsArray = [];

    for (const key in query) {
      if (Array.isArray(query[key])) {
        query[key].forEach(x => {
          paramsArray.push(x);
          if (count > 0) {
            where += ' OR '
          }
          where += `classes.` + key + `=$` + ++count;
        });
      } else {
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
    client.query('SELECT * FROM public.classes JOIN public.instructors on classes.instructor_id = instructors.instructor_id JOIN public.locations on classes.location_id = locations.location_id ' + where, paramsArray, (err, result) => {
      if (err) throw err;
      let data = JSON.stringify(result.rows);
      client.end();
      res.json(data);
    })
  } else {
    res.redirect('/');
  }
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
    let redirectUrl;
    if (instructor) {
      sql = "SELECT *, instructor_first_name AS first_name FROM public.instructors WHERE instructor_email = $1 AND instructor_pw = $2";
      redirectUrl = '/home_instructor';

    } else {
      sql = "SELECT *, user_first_name AS first_name FROM public.users WHERE user_email = $1 AND user_pw = $2"
      redirectUrl = '/index';
    }

    client.query(sql, [useremail, password], function (err, result) {
      if (err) throw err;
      if (result.rows.length > 0) {
        // initialize session
        let session = req.session;
        session.loggedin = true;
        data = result.rows;
        res.redirect(redirectUrl);
        client.end();
      }
      else {
        console.log("user not found");
        client.end();
        res.redirect(redirectUrl);
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



router.post('/edit_user_info', function (req, res, next) {
  let signup_useremail = req.body.useremail;
  let signup_first_name = req.body.first_name;
  let signup_last_name = req.body.last_name;
  let signup_street = req.body.street;
  let signup_building = req.body.building;
  let signup_zipcode = req.body.zipcode;
  let id;
  createClient();
  client.connect();
  sql = ' SELECT * FROM public.users WHERE users.user_email = $1';
  client.query(sql, [signup_useremail], function (err, result) {
    id = result.rows[0].user_id;

    sql = "UPDATE public.users SET user_email = $1, user_first_name = $2, user_last_name = $3, user_street = $4, user_building = $5, user_zipcode = $6 WHERE user_id = $7";
    client.query(sql, [signup_useremail, signup_first_name, signup_last_name, signup_street, signup_building, signup_zipcode, id], function (err, result) {
      if (err) throw err;
      client.end();
      console.log("changes saved");
    })

  })

})

module.exports = router;
