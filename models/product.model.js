const { default: mongoose } = require("mongoose");
const schema = mongoose.Schema;


const ProductSchema = new schema({
  _id: schema.Types.ObjectId,
  name:String,
  price:Number,
  stock:Number,
  category:{type:schema.Types.ObjectId,ref:'Category'}
})

const ProductModel = mongoose.model('Product',ProductSchema,'products');

module.exports = ProductModel;

// referans key model isinmleri üzerinden kuruluyor.