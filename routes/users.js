var express = require('express');
const db = require('../database/mongo.database');
var router = express.Router();
const { ObjectId } = require("mongodb");

router.get('/', async (req,res) => {

  const users = await db.collection('user').find().toArray();

  console.log('users', users);

  res.render('./user/list',{users})
});

//const { ObjectId } = require("mongodb");

router.get('/delete/:id', async (req,res) => {

  console.log('req.params.id',req.params.id);

  const deleteRes = await db.collection('user').findOneAndDelete({_id:  new ObjectId(req.params.id) });
  console.log('deleteRes', deleteRes);

  res.redirect('/users');

});

// query string router pattern oluşturmaya gerek yok ana path bakar.
// query değerleri req.query içierisibde okunur.
router.get('/delete', async (req,res) => {
  
  console.log('req.params.name',req.query.username);

  // const deleteRes = await db.collection('user').findOneAndDelete({username:  req.query.username });

  // const users = await db.collection('user').find({username:  req.query.username }).toArray();

  // if(users.length > 0) {
    await db.collection('user').deleteMany({username: req.query.username});

  // }

  

  // console.log('deleteRes', deleteRes);

  res.redirect('/users');

});

// /users user create form
/* GET users listing. */
router.get('/sign-up', function(req, res, next) {
  res.render('./user/userform');
});

router.post('/sign-up', (req,res) => {
  db.collection('user').insertOne(req.body).then((response1) => {
    console.log('response',response1);
    res.render('./user/userform', {message:'işlem başarılı'})
  }).catch(err => {
    console.log('err',err);
    res.render('./user/userform', {message:'işlem hatalı'})
  })
});

module.exports = router;
