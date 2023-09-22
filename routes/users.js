var express = require('express');
const db = require('../database/mongo.database');
var router = express.Router();
const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt'); // Hashleme işlemleri için kullandığımız paket.
const passport = require('passport');
const IsAuth = require('../helpers/auth');


router.get('/', async (req, res) => {

  const users = await db.collection('user').find().toArray();

  console.log('users', users);

  res.render('./user/list', { users })
});

//const { ObjectId } = require("mongodb");

router.get('/delete/:id', async (req, res) => {

  console.log('req.params.id', req.params.id);

  const deleteRes = await db.collection('user').findOneAndDelete({ _id: new ObjectId(req.params.id) });
  console.log('deleteRes', deleteRes);

  res.redirect('/users');

});

// query string router pattern oluşturmaya gerek yok ana path bakar.
// query değerleri req.query içierisibde okunur.
router.get('/delete', async (req, res) => {

  console.log('req.params.name', req.query.username);

  // const deleteRes = await db.collection('user').findOneAndDelete({username:  req.query.username });

  // const users = await db.collection('user').find({username:  req.query.username }).toArray();

  // if(users.length > 0) {
  await db.collection('user').deleteMany({ username: req.query.username });

  // }



  // console.log('deleteRes', deleteRes);

  res.redirect('/users');

});

// /users user create form
/* GET users listing. */
router.get('/sign-up', async function (req, res, next) {
  res.render('./user/userform');
});
// const bcrypt = require('bcrypt');
router.post('/sign-up', async (req, res) => {
  console.log('req', req.body);
  const salt = await bcrypt.genSalt(); // tuzlama yani hash zorlaştırma işlemi
  console.log('salt', salt);
  const hash = await bcrypt.hash(req.body.password, salt);
  console.log('hash', hash);

  const user = { username: req.body.username, hash: hash, salt: salt };
  // user.passwordHash =  hash;
  // user.salt = salt; // hem salt hemde hash değerini atıyoruz.

  db.collection('user').insertOne(user).then((response1) => {
    console.log('response', response1);
    res.render('./user/userform', { message: 'işlem başarılı' })
  }).catch(err => {
    console.log('err', err);
    res.render('./user/userform', { message: 'işlem hatalı' })
  })
});

// local yöntem ile authenticate ol
router.get('/login', async (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}), (req, res) => {
  res.redirect('/');
})


router.get('/logout', IsAuth, (req, res) => {
  // function callback.
  req.logOut(() => {
    res.redirect('/users/login');
  });
  // session destroy işlemi

})

module.exports = router;
