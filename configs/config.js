var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1:27017/book';
var outTime = 1 * 1 * 1 * 1; //默认1分钟
var db = mongoose.connection;
mongoose.connect(dbUrl);
/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
    console.log('Mongoose connection open to ');
});

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
var userData = new mongoose.Schema({
    store: [{
        title: String,
        imgUrl: String,
        bookNm: String
    }],
    nickNm: String,
    updated_at: Date,
});
module.exports = {
    userData: userData,
    dbUrl: dbUrl,
    outTime: outTime
};