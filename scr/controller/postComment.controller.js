const db = require("../config/db");
const { logError } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM post_comment")
        res.json({
            message: 'This is listing route.',
            list
        })
    } catch (err) {
        logError("post_comment.getList", err, res)
    }
}

//id	postId	parentId	title	published	publishedAt	content	
const create = async (req, res) => {
    try {
        var sql = `INSERT INTO post_comment
            (postId,parentId,title,published, content)
            VALUES (:postId,:parentId, :title ,:published,:content)`;
        var param = {
            
            postId: 2,
            parentId: 2,
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: 'Create successfully',
            data
        })
    } catch (err) {
        logError("post_comment.create", err, res)
    }
}

const update = async (req, res) => {
    try {
        var sql =`UPDATE post_comment SET
        parentId = :parentId,title =:title, postId = :postId, published=:published,content =:content
            WHERE id = :id`;
        var param = {
            id: req.body.id,
            postId: 2,
            parentId: 2,
            title: req.body.title,
            content: req.body.content,
            published: req.body.published
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "Update successfully" : "Not found"),
            data
        })
    } catch (err) {
        logError("post_comment.update", err, res)
    }
}


const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM post_comment WHERE id = :id"
        var param = {
            id: req.body.id
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        })
    } catch (err) {
        logError("post_comment.remove", err, res)
    }
}


module.exports = {
    getList,
    create,
    update,
    remove,

}