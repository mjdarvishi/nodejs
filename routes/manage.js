var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', checkmanage, function (req, res, next) {
    res.render('manage', {title: "مدیریت فروشگاه"});
});
router.get('/showbook', function (req, res, next) {
    var book = req.db.get('book');
    book.find({}, {}, function (err, books) {
        if (err) throw err;
        res.render('showbook', {books: books, title: "مدیریت فروشگاه"});

    });
});
router.post('/dellbook', function (req, res, next) {
    var book = req.db.get('book');
    book.remove({_id: req.body.name});
    res.redirect('/manage/showbook');
});
router.get('/editbook/:id', function (req, res, next) {
    var book = req.db.get('book');
    book.findOne({_id: req.params.id}, {}, function (err, books) {
        res.render('editbook', {title: "ویرایش پست", book: books});
    });
});
router.post('/editbook', function (req, res, next) {
    var book = req.db.get('book');
    book.update({_id: req.body.id}, {title: req.body.title, cat: req.body.cat, body: req.body.text,price: req.body.price,auther: req.body.auther,
    publisher: req.body.publisher,num: req.body.num
    });
    res.redirect("/manage/showbook");
});
router.get('/addbook',function (req,res,next) {
   res.render('addbook',{title:'مدیریت فروشگاه'}) ;
});
router.post('/addbook', function (req, res, next) {
    var book = req.db.get('book');
    book.insert({
        title: req.body.title,
        cat: req.body.cat,
        body: req.body.text,
        price:req.body.price,
        auther:req.body.auther,
        publisher:req.body.publisher,
        num:req.body.num
    }, function (err, post) {
        if (err) throw err;
        console.log(post);
        req.flash('sucess', 'پست شما با موفقیت ثبت شد')
        res.redirect('/manage');
    });
});

module.exports = router;


function checkmanage(req, res, next) {
    if (req.user)
        if (req.user.status == 1)
            next();
        else
            res.redirect('/book');
}



