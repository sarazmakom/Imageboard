var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images`);
};

module.exports.uploadImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [url, username, title, description]
    );
};
