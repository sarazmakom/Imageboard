const express = require("express");
const app = express();
const db = require("./db.js");
const config = require("./config");
const s3 = require("./s3.js");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.get("/images", function(req, res) {
    db.getImages().then(results => {
        res.json({
            images: results.rows
        });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // console.log("s3 up", req.file);
    db
        .uploadImage(
            config.s3Url + req.file.filename,
            req.body.username,
            req.body.title,
            req.body.description
        )
        .then(function(result) {
            res.json({
                id: result.rows[0].id,
                title: req.body.title,
                description: req.body.description,
                username: req.body.username,
                url: config.s3Url + req.file.filename
            });
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(8080, () => console.log("listening on 8080"));

// if(req.files){
//     s3Upload(req.files).then(()=>{
//         return db.uploadImage().then(results => {
//         res.json({
//             img: req.file.filename
//         });
//     });
// } else {
//
// }
