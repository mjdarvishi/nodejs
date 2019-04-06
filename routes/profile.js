var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',ensure, function(req, res, next) {
    res.render('profile',{title:"پروفایل کاربری"});
});
module.exports = router;
function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/users');

}