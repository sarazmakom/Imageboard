const express = require("express");
const app = express();
const db = require("./db.js");
const config = require("./config");
const s3 = require("./s3.js");
const bodyParser = require("body-parser");

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

app.use(bodyParser.json());

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.get("/images", function(req, res) {
    db.getImages().then(results => {
        // console.log(results.rows);
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
//
// app.get("/images/:id", function(req, res) {
//     console.log(req.params.id);
//     db
//         .getMore(req.params.id)
//         .then(function(result) {
//             res.json(result.rows);
//         })
//         .catch(function(err) {
//             console.log(err);
//         });
// });

app.get("/image/:id", function(req, res) {
    // Promise.all([
    //     db.getImageById(req.params.id),
    //     db.getCommentByImageId(req.params.id)
    // ]);
    db
        .getImageById(req.params.id)
        .then(function(result) {
            res.json(result.rows[0]);
        })
        .catch(function(e) {
            console.log(e);
        });
});

app.post("/comments/", function(req, res) {
    db
        .uploadComments(req.body.username, req.body.comment, req.body.image_id)
        .then(function(result) {
            res.json(result.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/comments/:id", function(req, res) {
    db
        .getCommentByImageId(req.params.id)
        .then(function(result) {
            res.json(result.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.listen(8080, () => console.log("listening on 8080"));
