var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});
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


/* GET home page. */
router.get('/', function (req, res, next) {
    connection.query('select * from projects',function (err,result) {
       if (err) throw err;
       if (result){
           console.log(result)
           res.render('gallery/index', {projects:result,title: "صفحه ی اصلی گالری"});

       }
    });
});
router.get('/admin', function (req, res, next) {
    res.render('gallery/admin', {title: "صفحه ی اصلی مدیریت"});
});
router.get('/add', function (req, res, next) {
    res.render('gallery/add', {title: "صفحه ی  مدیریت"});
});
router.post('/add', upload.single('image'),function (req, res) {
    var image;
    if (req.file) {
        image = req.file.filename;
        console.log("is uploading.....");
    } else {
        console.log("file is not uploading");
        image = "no.png"
    }
    var project={
        title:req.body.title,
        description:req.body.description,
        url:req.body.url,
        client:req.body.client,
        image:'/upload/'+image,
        date:req.body.date1
    }
    var query=connection.query('INSERT INTO PROJECTS SET ?',project,function (err,reslt) {
        if (err) throw err;
        if (reslt){
            console.log(reslt);
        }
        res.redirect('/gallery/add')
    });
});


module.exports = router;






