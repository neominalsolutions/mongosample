const express = require('express');
const PostModel = require('../models/posts.model');
const router = express.Router();

router.get('/', (req,res) => {
   PostModel.find().then((posts)=> {
    console.log('posts',posts)
    res.status(200).json(posts);
  })
});
  // req.body dto => schema ile aynı model formatında ise mapper ihtiyaç yok. Modelimize parametre olarak gönderilen json değer. Entity oluşturuyor.
router.post('/', (req,res) => {
  const dto = {title:'makale-1',body:'makale-içerik', 
  comments:[{commentBy:'ali',text:'Yorum-1'},{commentBy:'can',text:'Yorum-2'}]};
  const post = new PostModel(dto); // post dto ile işlem yaptığımı database modeli
  // PostModel.create(dto)
  post.save().then(response => {
    console.log('response', response);
    res.status(201).json(response);
  }).catch(err => {
    console.log('err',err);
  })

});

router.put('/:id', (req,res) => {
  res.json([]);
});

router.delete('/:id', (req,res) => {
  res.json([]);
});

module.exports = router;
