var express = require('express');
var maile = require('nodemailer');
var router = express.Router();
console.log("contact Router");

/* GET home page. */

router.get('/', ensure, function (req, res, next) {
    res.render('contact', {title: "صفحه ی ارسال ایمیل"});
});
router.post('/send',ensure,function (req, res, next) {
    var transport = maile.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "mjdarvishi1374@gmail.com",
            pass: "javad1080380868"
        }
    });
    var option = {
        from: "mjdarvishi1374@gmail.com",
        to: req.body.email,
        subject: req.body.title,
        text: req.body.emailtext

    }
    transport.sendMail(option, function (err, info) {
        if (err) throw err
        else {
            console.log(info.response)
            res.redirect('/');
        }
    })
});

function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else
       res.redirect('/users');

}

module.exports = router;
