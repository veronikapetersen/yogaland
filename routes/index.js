var express = require('express');
var session = require('express-session');
var router = express.Router();
const multer = require('multer');
var path = require('path');
// const bcrypt = require('bcrypt');


const { Client } = require('pg');
//let client;
function createClient() {
  let client = new Client({
    connectionString: 'postgres://tbfnnuirlbjgnp:1fba8e67df7a5cd9db62a91904e224de773d0deaeed315be1c29bee90e6b84ca@ec2-34-242-84-130.eu-west-1.compute.amazonaws.com:5432/d9cf4rej73i41r',
    ssl: { rejectUnauthorized: false }
  })
  return client;
}

const imageUpload = multer({
  storage: multer.diskStorage(
    {
      destination: function (req, file, cb) {
        cb(null, 'public/images');
      },
      filename: function (req, file, cb) {
        cb(
          null,
          new Date().valueOf() +
          '_' +
          file.originalname
        );
      }
    }),
});

router.get('/image/:filename', (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const src = path.join('/images/' + filename)
  const srcFull = path.join('public/images/' + filename)
  const fullfilepath = path.join(dirname, 'public/images/' + filename);

  let session = req.session;
  if (session.loggedin) {
    const client = createClient();
    client.connect();
    let sql = 'SELECT * FROM public.images WHERE user_id = $1 and image_filepath = $2';
    // let sql = 'SELECT * FROM public.images WHERE user_id = $1';
    let user_id = data[0].user_id;
    client.query(sql, [user_id, srcFull], (err, result) => {
      if (err) throw err;
      let imageData = result.rows;
      console.log("image data :", imageData);
    })
  } else {
    res.redirect('/');
  }

  // return res.sendFile(fullfilepath);
});



router.post('/image', imageUpload.single('fileToUpload'), (req, res) => {
  let session = req.session;
  if (session.loggedin) {
    const { filename, mimetype, size } = req.file;
    // const filepath = req.file.path;
    const filepath = req.file.path.replace("public/", "/");

    let client = createClient();
    client.connect();

    let sql = 'INSERT INTO public.images (image_filename, image_filepath, image_mimetype, image_size, user_id) VALUES ($1, $2, $3, $4, $5)'
    client.query(sql, [filename, filepath, mimetype, size, req.body.user_id], (err, result) => {
      if (err) throw err;
      let fileUploadData = result.rows;
      client.end();
      // res.json(fileUploadData);
      res.redirect(`/users/${req.body.user_id}/profile`);
    })
  } else {
    res.redirect('/');
  }
});

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

router.get('/home_user', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    res.render('home_user', { title: 'YogaLand', data: data })
    console.log("home user page data: ", data)
  } else {
    res.redirect('/');
  }
})

router.get('/logout', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    req.session.destroy(function (err) {
      if (err) throw err;
      res.redirect('/');
    });
  }
})


router.get('/users/:id/profile', function (req, res, next) {
  let session = req.session;

  if (session.loggedin) {
    createClient();
    let client = createClient();
    client.connect();
    client.query('SELECT *, (SELECT images.image_filepath FROM public.images WHERE images.user_id = users.user_id LIMIT 1) AS src, users.user_first_name AS first_name FROM users WHERE users.user_id = $1', [req.params.id], (err, result) => {
      if (err) throw err;
      let data = result.rows[0];
      console.log("profile url data: ", data);
      client.end();
      res.render('profile', { title: 'YogaLand', data: data });
    })

  } else {
    res.redirect('/');
  }

})

router.get('/user/:id/past_classes', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    let client = createClient();
    // createClient();
    client.connect();
    let sql = 'SELECT * FROM public.bookings INNER JOIN public.users on bookings.user_id = users.user_id INNER JOIN public.classes on bookings.class_id = classes.class_id INNER JOIN public.locations on classes.location_id = locations.location_id WHERE bookings.user_id = $1 AND classes.class_date < CURRENT_DATE'
    client.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      let data = result.rows;
      console.log(data);
      client.end();
      res.json(data);
    })
  } else {
    res.redirect('/');
  }
})


router.get('/user/:id/next_classes', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    let client = createClient();
    // createClient();
    client.connect();
    let sql = 'SELECT * FROM public.bookings INNER JOIN public.users on bookings.user_id = users.user_id INNER JOIN public.classes on bookings.class_id = classes.class_id INNER JOIN public.locations on classes.location_id = locations.location_id WHERE bookings.user_id = $1 AND classes.class_date > CURRENT_DATE'
    client.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      let data = result.rows;
      console.log(data);
      client.end();
      res.json(data);
    })
  } else {
    res.redirect('/');
  }
})


router.get('/discounts', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    let client = createClient();
    // createClient();
    client.connect();
    let sql = 'SELECT * FROM public.classes where classes.discount = true ORDER BY classes.class_date ASC LIMIT 6'
    client.query(sql, (err, result) => {
      if (err) throw err;
      let discountsData = result.rows;
      console.log(discountsData);
      client.end();
      res.json(discountsData);
    })
  } else {
    res.redirect('/');
  }
})




router.get('/class/:id', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    // createClient();
    let client = createClient();
    client.connect();
    client.query(`SELECT *,
    (SELECT bookings.booking_id AS signedup FROM public.bookings WHERE bookings.class_id = classes.class_id AND bookings.user_id = $2 LIMIT 1) 
    FROM public.classes 
    JOIN public.locations on locations.location_id = classes.location_id 
    JOIN public.instructors on instructors.instructor_id = classes.instructor_id 
    WHERE class_id = $1`, [req.params.id, session.user_id], (err, result) => {
      if (err) throw err;
      let queryData = result.rows[0];
      console.log("my class", queryData);
      client.end();
      res.render('single_class', { title: 'YogaLand', queryData: queryData, data: data });
    })
  } else {
    res.redirect('/');
  }
})

router.get('/instructor/:id', function (req, res, next) {
  let session = req.session;
  if (session.loggedin) {
    // createClient();
    let client = createClient();
    client.connect();
    //instructor information
    client.query('SELECT * FROM public.instructors JOIN public.reviews on instructors.instructor_id = reviews.instructor_id WHERE instructors.instructor_id = $1', [req.params.id], (err, result) => {
      if (err) throw err;
      let queryData = result.rows[0];
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
            first_name: queryData.instructor_first_name,
            last_name: queryData.instructor_last_name,
            experience: queryData.instructor_experience,
            reviews: datareviews,
            upcomingClasses: upcomingClasses,
            data: data
          });
        });
      });
    })
  } else {
    res.redirect('/');
  }
});

router.get('/index', function (req, res, next) {
  //  initialize session:
  let session = req.session;
  if (session.loggedin) {

    // createClient();
    let client = createClient();
    client.connect();
    let sql = 'SELECT * , (SELECT COUNT(*) AS reservations FROM public.bookings AS b WHERE b.class_id = c.class_id), (SELECT bookings.booking_id AS signedup FROM public.bookings WHERE bookings.class_id = c.class_id AND bookings.user_id = $1 LIMIT 1) FROM public.classes as c '
      + ' JOIN public.instructors on c.instructor_id = instructors.instructor_id '
      + ' JOIN public.locations on c.location_id = locations.location_id '
      + ' WHERE c.class_date > CURRENT_DATE'
      + ' ORDER BY c.class_date ASC';
    client.query(sql, [session.user_id], (err, result) => {

      console.log(sql);
      if (err) throw err;
      let classesQueryData = result.rows;
      client.end();
      // res.render('index', { title: 'YogaLand', classesData: classesQueryData });
      res.render('index', { title: 'YogaLand', classesData: classesQueryData, data: data });
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
    if (Object.keys(query).length !== 0) {
      for (const key in query) {
        if (Array.isArray(query[key])) {
          let subCount = 0;
          if (count > 0) {
            where += ' AND '
          }
          where += '(';
          query[key].forEach(x => {
            paramsArray.push(x);
            if (subCount > 0) {
              where += ' OR '
            }
            subCount++;
            where += `classes.` + key + `=$` + ++count;
          });
          where += ')';
        } else {
          paramsArray.push(query[key]);
          if (count > 0) {
            where += ' AND '
          }
          where += `classes.` + key + `=$` + ++count;
        }
      }
    } else {
      where = ' ';
    }

    console.log("params array:", paramsArray);
    // createClient();
    let client = createClient();
    client.connect();
    // let sql = 'SELECT * FROM public.classes JOIN public.instructors on classes.instructor_id = instructors.instructor_id JOIN public.locations on classes.location_id = locations.location_id ' + where;
    let sql = `SELECT *, 
    (SELECT COUNT(*) AS reservations FROM public.bookings WHERE bookings.class_id = classes.class_id), 
    (SELECT bookings.booking_id AS signedup FROM public.bookings WHERE bookings.class_id = classes.class_id AND bookings.user_id = $${++count} )
    FROM public.classes 
    JOIN public.instructors on classes.instructor_id = instructors.instructor_id 
    JOIN public.locations on classes.location_id = locations.location_id ` + where;
    console.log("sql: ", sql);
    client.query(sql, [paramsArray, session.user_id], (err, result) => {
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
  // createClient();
  let client = createClient();
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
      sql = "SELECT *, (SELECT images.image_filepath FROM public.images WHERE images.user_id = users.user_id LIMIT 1) AS src, user_first_name AS first_name FROM public.users WHERE user_email = $1 AND user_pw = $2"
      redirectUrl = '/home_user';
    }

    client.query(sql, [useremail, password], function (err, result) {
      if (err) throw err;
      if (result.rows.length > 0) {
        // initialize session
        let session = req.session;
        session.loggedin = true;
        // data = result.rows;
        data = result.rows[0];
        session.user_id = data.user_id;
        // data[0].isInstructor = instructor;
        data.isInstructor = instructor;

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
  // createClient();
  let client = createClient();
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
  // createClient();
  let client = createClient();
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



router.post('/class_signup', function (req, res, next) {

  let class_id = req.body.class_id;
  let user_id = data.user_id;
  // let user_id = session.user_id;
  console.log("class id: ", class_id, "user_id: ", user_id);
  let sql = 'INSERT INTO public.bookings (class_id, user_id) VALUES ($1, $2)'
  let checkSql = 'SELECT * FROM public.bookings WHERE class_id = $1 AND user_id = $2'
  let client = createClient();
  client.connect();
  client.query(checkSql, [class_id, user_id], function (err, result) {
    if (err) throw err;
    if (result.rowCount === 0) {
      client.query(sql, [class_id, user_id], function (err, result) {
        if (err) throw err;
        if (result.rowCount.length > 0) {
          client.end();
          res.send("signed up for this class!");
          console.log("signed up");
        }
      })
    }
  });
})






module.exports = router;
