const { MongoClient } = require("mongodb");

// mongoDb bağlantı dosyası
// fiziki olarak development modda localhost bağlantısı yapacaksak 
// mongodb://localhost:27017 yazmayalım.
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'test';

client.connect().then(()=> {
  console.log('bağlantı başarılı')
}).catch(err => {
  console.log('connection err', err);
});

const db = client.db(dbName);

module.exports = db;

