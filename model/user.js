var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth', {useNewUrlParser: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var bcrypt = require('bcryptjs');

var schema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    email: {
        type: String
    },
    pass: {
        type: String
    },
    avatar: {
        type: String
    },
    status: {
        type: String
    }
});


var user = module.exports = mongoose.model('User', schema);

module.exports.CreateUser = function (newuser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newuser.pass, salt, function (err, hash) {
            newuser.pass = hash;
            newuser.save(callback);

        })
    });
};

module.exports.getuserlogin = function (username, password, callback) {
    console.log(username + "/" + password);
    user.findOne({
        email: username
    }, callback);
};
module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
}
module.exports.comparePassword = function (condidatepassword, hash, callback) {
    bcrypt.hash(condidatepassword, hash, function (err, ismatch) {
        callback(null, ismatch);
    });

}