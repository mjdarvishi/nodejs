var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
var user = require('../model/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var multer = require('multer');
var upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, './public/upload');
        },
        filename: function (req, file, cb) {
            var ext = require('path').extname(file.originalname);
            ext = ext.length > 1 ? ext : "." + require('mime').extension(file.mimetype);
            require('crypto').pseudoRandomBytes(16, function (err, raw) {
                cb(null, (err ? undefined : raw.toString('hex')) + ext);
            });
        }

    })
});


passport.use(new LocalStrategy(
    function (username, password, done) {
        user.getuserlogin(username, password, function (err, users) {
            if (err) {
                return done(err);

            }
            if (!users) {
                return done(null, false);
            }
            user.comparePassword(password, users.pass, function (err, ismatch) {
                if (err)
                    throw  err;
                if (ismatch)
                    return done(null, users);
                else
                    return done(null, false);

            });
        });
    }
    )
);


passport.serializeUser(function (user, cb) {
    console.log("serializeing.....");
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    console.log("deserializeing.....");
    user.findById(id, function (err, user) {
        console.log(user);
        cb(err, user);
    });
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: "صفحه ی ورود/ثبت نام"});
});


router.post('/', passport.authenticate('local', {failureRedirect: '/users'}), function (req, res, next) {
    res.redirect('/');
});

router.post('/reg', upload.single('avatar'), [
    check('email').isEmail(),
    check('pass').isLength({min: 5})
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    var username = req.body.user;
    var pass = req.body.pass;
    var email = req.body.email;
    var image;

    var newuser = new user({
        name: username,
        email: email,
        pass: pass,
        avatar: '/upload/'+image,
        status:'0'
    });
    user.CreateUser(newuser, function (err, user) {
        if (err) throw err
        else
            console.log(user.toString());
    });
    res.redirect("/users");
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/users');
});


module.exports = router;






