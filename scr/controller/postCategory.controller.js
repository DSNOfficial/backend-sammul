const db = require("../config/db");
const { logError } = require("../config/helper");

// Get List of post_category
const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM post_category WHERE 1=1 ORDER BY id DESC");
        res.json({
            message: 'This is listing route.',
            list
        });
    } catch (err) {
        logError("post_category.getList", err, res);
    }
};

// Create a new post_category
const create = async (req, res) => {
    try {
        const sql = `
            INSERT INTO post_category (postId, parentId, title, published, content)
            VALUES (:postId, :parentId, :title, :published, :content)
        `;
        const param = {
            postId: req.body.postId,
            parentId: req.body.parentId,
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
        };
        const [data] = await db.query(sql, param);
        res.json({
            message: 'Create successfully',
            data
        });
    } catch (err) {
        logError("post_category.create", err, res);
    }
};

// Update an existing post_category
const update = async (req, res) => {
    try {
        const sql = `
            UPDATE post_category SET
            postId = :postId, parentId = :parentId, title = :title, published = :published, content = :content
            WHERE id = :id
        `;
        const param = {
            id: req.body.id,
            postId: req.body.postId,
            parentId: req.body.parentId,
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
        };
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Update successfully" : "Not found",
            data
        });
    } catch (err) {
        logError("post_category.update", err, res);
    }
};

// Remove a post_category
const remove = async (req, res) => {
    try {
        const sql = "DELETE FROM post_category WHERE id = :id";
        const param = {
            id: req.body.id,
        };
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        });
    } catch (err) {
        logError("post_category.remove", err, res);
    }
};

module.exports = {
    getList,
    create,
    update,
    remove,
};
