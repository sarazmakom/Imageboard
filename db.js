var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = function() {
    return db.query(`SELECT * FROM images
                    ORDER BY id DESC
                    LIMIT 12`);
};

exports.uploadImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [url, username, title, description]
    );
};

exports.getImageById = function(id) {
    return db.query(
        `
        SELECT * FROM images
        WHERE id=$1
        `,
        [id]
    );
};

exports.getCommentByImageId = function(imageId) {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1
        `,
        [imageId]
    );
};

exports.uploadComments = function(username, comment, image_id) {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [username, comment, image_id]
    );
};
//
// exports.getMore = function(imageId) {
//     return db.query(
//         `SELECT * FROM images
//         WHERE id < $1
//         ORDER BY id DESC
//         LIMIT 12`,
//         [imageId]
//     );
// };
