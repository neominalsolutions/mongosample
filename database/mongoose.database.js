const { default: mongoose } = require("mongoose");
const connectionString = 'mongodb://127.0.0.1:27017/testDb';
// const connectionString = 'mongodb://127.0.0.1:27017<username>:<password>/testDb?dbconfig';

mongoose.connect(connectionString).then(()=> {

  console.log("Mg bağlantı");

}).catch(err => {

});

const mongooseDb = mongoose.connection;

module.exports = mongooseDb;



