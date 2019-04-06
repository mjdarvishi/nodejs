var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var books = req.db.get('book');
    books.find({}, {}, function (err, books) {
        if (err) throw err;
        res.render('shoping', {book: books, title: "صفحه ی اصلی کتاب فروشی"});
    });
});
router.get('/detail/:id', function (req, res, next) {
    var book = req.db.get('book');
    book.findOne({_id: req.params.id}, {}, function (err, books) {
        if (err) throw err;
        res.render('detail', {book: books, title: " کتاب فروشی"});

    });
});
router.post('/search', function (req, res, next) {
    if (!req.body.search)
        res.redirect('/book');
    var books = req.db.get('book');
    var title;
    books.find({title: req.body.search}, {}, function (err, books) {
        if (err) throw err;
        title = books;
    });
    books.find({cat: req.body.search}, {}, function (err, books) {
        if (err) throw err;
        res.render('shoping', {name: title, cat: books, title: "صفحه ی اصلی کتاب فروشی"});
    });
});
router.post('/addpro', ensure, function (req, res, next) {
    var basket = req.db.get('basket');
    basket.insert({
        user_id: req.user._id,
        pro_id:req.body.pro_id,
        title:req.body.pro_title,
        price:req.body.pro_price,
        avatar:req.body.pro_avatar,
        num:req.body.num
    },function (err,basket) {
       if (err)throw err;
       res.redirect('/book');
    });
});
router.get('/card',ensure,function (req,res,next) {
   var basket=req.db.get('basket');
   basket.find({user_id:req.user._id},{},function (err,baskets) {
       res.render('shoppingcard',{basket:baskets,title:'سبد خرید'})
   });
});

function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/users');

}

module.exports = router;






