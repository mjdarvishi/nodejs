var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');


/* GET home page. */
router.get('/', ensure, function (req, res, next) {
    res.render('blog', {title: "صفحه ی اصلی وبلاگ"});
});
router.get('/post', ensure, function (req, res, next) {
    var db = req.db;
    var posts = db.get('post');
    posts.find({}, {}, function (err, posts) {
        if (err) throw err;
        console.log(posts);
        res.render('showpost', {title: "صفحه ی اصلی وبلاگ,نمایش پست ها", posts: posts});
    });
});
router.get('/cat', ensure, function (req, res, next) {
    var db = req.db;
    var posts = db.get('category');
    posts.find({}, {}, function (err, posts) {
        if (err) throw err;
        console.log(posts);
        res.render('showcat', {title: "صفحه ی اصلی وبلاگ,نمایش پست ها", posts: posts});
    });
});
router.get('/addpost', ensure, function (req, res, next) {
    var post = req.db.get('category');
    post.find({}, {}, function (err, post) {
        if (err) throw err;
        res.render('addpost', {cat: post, title: "اضافه کردن پست"});
    });

});
router.get('/addcat', ensure, function (req, res, next) {
    res.render('addcat', {title: "اضافه کردن دسته بندی"});
});
router.post('/addcat', ensure, [
    check('name').isLength({min: 3})
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    var title = req.body.name;
    var post = req.db.get('category');
    post.insert({
        name: title
    }, function (err, post) {
        if (err) throw err;
        console.log(post);
        req.flash('sucess', 'پست شما با موفقیت ثبت شد')
        res.redirect('/blog');
    });
});
router.post('/addpost', ensure, [
    check('title').isLength({min: 5}),
    check('text').isLength({min: 5}),
    check('cat').isLength({min: 5})
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    var title = req.body.title;
    var cat = req.body.cat;
    var text = req.body.text;
    console.log(title);
    var post = req.db.get('post');
    post.insert({
        title: title,
        cat: cat,
        body: text
    }, function (err, post) {
        if (err) throw err;
        console.log(post);
        req.flash('sucess', 'پست شما با موفقیت ثبت شد')
        res.redirect('/blog');
    });
});

router.post('/delpost', function (req, res, next) {
    var post = req.db.get('post');
    console.log(req.body.name);
    post.remove({_id: req.body.name});
    res.send("1");
});
router.post('/delcat', function (req, res, next) {
    var post = req.db.get('category');
    console.log(req.body.name);
    post.remove({_id: req.body.name});
    res.send("1");
});
router.get('/editpost/:id', function (req, res, next) {
    console.log(req.params.id);
    var post = req.db.get('post');
    var cat = req.db.get('category');
    var cats;
    cat.find({}, {}, function (err, cat) {
        cats = cat;
    });
    var posts = post.find({_id: req.params.id}, {}, function (err, post) {
        console.log(post);
        res.render('editpost', {title: "ویرایش پست", posts: post, cat: cats});
    });

});
router.post('/editpost', function (req, res, next) {
    var post = req.db.get('post');
    post.update({_id: req.body.id}, {title: req.body.title, cat: req.body.cat, body: req.body.text});
    res.redirect("/blog/post");
});
router.post('/editcat', function (req, res, next) {
    var post = req.db.get('category');
    post.update({_id: req.body.id}, {name: req.body.name});
    res.redirect("/blog/cat");
});
router.get('/editcat/:id', function (req, res, next) {
    var post = req.db.get('category');
    post.find({_id: req.params.id}, {}, function (err, post) {
        console.log(post);
        res.render('editcat', {title: "ویرایش دسته", posts: post});
    });
});

function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/users');

}

module.exports = router;






