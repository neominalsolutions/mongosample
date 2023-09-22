var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const db = require('./database/mongo.database');
const mongooseDb = require('./database/mongoose.database');
const bcrypt = require('bcrypt'); // Hashleme işlemleri için kullandığımız paket.
// user bilgisi mongodb üzerinde
// product,category, post,comment mongoose da
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
require('dotenv').config() // ana dizinden uygulama genelinde env dosyasına tanımlanmış değişkenleri okumamız sağlar.

// console.log('env-config', process.env);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.Session_Key, // config dosyasından okunmalıdır.
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hours
  }
}));

app.use(passport.initialize()); // express passport session initializer.
app.use(passport.session()); // passport ile express-session birlikte kullanılsın.




// session ile çalışırken session değerinin route yönlendirmesi öncesinde konfigüre olması gerekiyor.

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// bu middlewareden geçmesi için passport.authenticate() middleware tetiklememiz lazım.
// login post işleminde passport.authenticate('local') yapıyı aktif hale getiririz.
passport.use(new LocalStrategy(function verify(username, password, cb) {

  console.log('username', username);
  console.log('password', password);


  db.collection('user').findOne({ username: username }).then(user => {
    console.log('user', user);
    if (user) {
      const salt = user.salt;
      // promise then için await kullanamayız.
      bcrypt.hash(password, salt).then(result => {
        const newHash = result

        console.log('newHash', newHash)

        if (newHash == user.hash) {
          console.log('newHash')
          // paraola gibi hassas bilgileri session atmadık
          return cb(null, { id: user._id.toString(), username: user.username });
        } else {
          console.log('else')
          return cb(null, false, { message: 'kullanıcı sistemde tanımlı değil' });
        }
      })

    }
  })
}));

// login olurken login olan kullanıcı bilgisini serialize edip session ekliyor.
passport.serializeUser(function (user, cb) {
  console.log('serializer-user-session', user);
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

// siz user bilgisine sessiondan ulaşmak istersek req.user ile bağlnatı yapıp deserizer çalışır.
passport.deserializeUser(function (user, cb) {
  console.log('deserializer-user-session', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
