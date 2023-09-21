const { default: mongoose, SchemaType } = require("mongoose");
const schema = mongoose.Schema;

// embdeded dosyaları tek bir schema dosyası altına toplarız
// comment post içinde kalacağı için burada sadece model olarak post çıkaracağız.
// uygumada commentlere direkt erişim olmayacak.
const commentSchema = new schema({
  _id:{ type:schema.Types.ObjectId},
  commentBy: String,
  text:String
});

const postSchema = new schema({
  _id:{ type: schema.Types.ObjectId, required:true, auto:true },
  title: {type:String, unique:true, required:true },
  body:String,
  comments: [commentSchema]
});

// posts collections içine 
const PostModel = mongoose.model('Post',postSchema,'posts');
module.exports = PostModel;

// const p = new PostModel();

