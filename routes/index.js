var express = require('express');
const { SchemaTypes, default: mongoose } = require('mongoose');
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');
var router = express.Router();
const mongooseDb = require('./../database/mongoose.database');
const IsAuth = require('../helpers/auth');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', currentUser: { ...req.user } });
});


router.get('/ref-relations', IsAuth, async (req, res) => {

  // if (req.user) {
  const session = await mongooseDb.startSession();
  try {

    session.startTransaction();

    // await c1.save();
    // console.log('c1',c1);
    const c1 = new CategoryModel({
      _id: new mongoose.Types.ObjectId(),
      name: 'Kategori-35',
    });
    const p1 = new ProductModel({ _id: new mongoose.Types.ObjectId(), name: 'p17', price: 15, stock: 25, category: c1 });
    const p2 = new ProductModel({ _id: new mongoose.Types.ObjectId(), name: 'p27', price: 100, stock: 200, category: c1 });
    // ProductModel.create([{_id: new mongoose.Types.ObjectId(),name:'p14', price:10, stock:20,category:c1 },{_id: new mongoose.Types.ObjectId(),name:'p24', price:100, stock:200, category:c1}],)

    c1.products.push(p1);
    c1.products.push(p2);

    await CategoryModel.create([c1], { session });
    await ProductModel.create([p1], { session });
    await ProductModel.create([p2], { session });

    // await c1.save({session}); // transaction session içinden çalışır.session açmak zorundayız.
    // await p1.save({session});
    // await p2.save({session});

    session.commitTransaction();

  } catch (error) {
    console.log('a', error);
    session.abortTransaction();
  } finally {
    // her ihtimale karşı session kapat.

  }

  await session.endSession();

  return res.json([]);
  // } else {
  //   res.status(401).send('oturum açmanız gerekir')
  // }



})

// ref ilişki olduğu durumda referans değeri dokuman içerisinde joinleyip getirme
router.get('/populate', (req, res) => {
  CategoryModel.find().populate('products').then(response => {
    return res.json(response);
  }).catch(err => {
    console.log('err', err);
  })
});

module.exports = router;
