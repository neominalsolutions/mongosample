const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema;

const CategorySchema = new schema({
  _id:schema.Types.ObjectId,
  name:String,
  products:[{type:schema.Types.ObjectId,ref:'Product'}],
  // subCategories:[CategorySchema]
})

const CategoryModel = mongoose.model('Category',CategorySchema,'categories');

module.exports = CategoryModel;