const db = require("../config/db");
const { logError } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM role WHERE 1=1 ORDER BY id DESC")
        res.json({
            message: 'This is listing route.',
            list,
            userThatRequested:req.user
        })
    } catch (err) {
        logError("role.getList", err, res)
    }
}
//	id	parentId	title	metaTitle	slug	content
const create = async (req, res) => {
    try {
        var sql = `INSERT INTO role
            (name, code, status)
            VALUES (:name, :code,:status)`;
        var param = {
            name: req.body.name,
            code: req.body.code,
            status: req.body.status
            
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: 'Create successfully',
            data
        })
    } catch (err) {
        logError("role.create", err, res)
    }
}

const update = async (req, res) => {
    try {
        var sql =`UPDATE role SET
        name = :name,code =:code, status = :status
            WHERE id = :id`;
        var param = {
            id: req.body.id,
            name: req.body.name,
            code: req.body.code,
            status: req.body.status
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "Update successfully" : "Not found"),
            data
        })
    } catch (err) {
        logError("role.update", err, res)
    }
}


const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM role WHERE id = :id"
        var param = {
            id: req.body.id
        
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        })
    } catch (err) {
        logError("role.remove", err, res)
    }
}


module.exports = {
    getList,
    create,
    update,
    remove,

}