const db = require("../config/db");
const { logError } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM post_meta")
        res.json({
            message: 'This is listing route.',
            list
        })
    } catch (err) {
        logError("post_meta.getList", err, res)
    }
}

//id	postId	key	content	
const create = async (req, res) => {
    try {
        var sql = `INSERT INTO post_meta
            (postId,key, content)
            VALUES (:postId,:key,:content)`;
        var param = {        
            postId:req.body.postId,
            key:req.body.key,
            content:req.body.content,    
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: 'Create successfully',
            data
        })
    } catch (err) {
        logError("post_meta.create", err, res)
    }
}

const update = async (req, res) => {
    try {
        var sql =`UPDATE post_meta SET
        postId = :postId,key =:key,content =:content
            WHERE id = :id`;
        var param = {
            id: req.body.id,
            postId: 2,
            key:req.body.key,
            content: req.body.content,    
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "Update successfully" : "Not found"),
            data
        })
    } catch (err) {
        logError("post_meta.update", err, res)
    }
}


const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM post_meta WHERE id = :id"
        var param = {
            id: req.body.id
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        })
    } catch (err) {
        logError("post_meta.remove", err, res)
    }
}


module.exports = {
    getList,
    create,
    update,
    remove,

}