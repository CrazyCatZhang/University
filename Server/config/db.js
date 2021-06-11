// getting-started.js
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/im', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.info('Sucess');
});


module.exports = db;