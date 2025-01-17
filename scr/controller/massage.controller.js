const db = require("../config/db");
const { logError } = require("../config/helper");
const massage = require("../route/massage.route");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM tbmassage WHERE 1=1 ORDER BY id DESC")
        res.json({
            message: 'This is listing route.',
            list,
            userThatRequested:req.user
        })
    } catch (err) {
        logError("tbmassage.getList", err, res)
    }
}
//	id	parentId	title	metaTitle	slug	content
const create = async (req, res) => {
    try {
        var sql = `INSERT INTO tbmassage
            (title, Phone, Massage,Email)
            VALUES (:title, :Phone,:Massage,:Email)`;
        var param = {
            title: req.body.title,
            Phone: req.body.Phone,
            Massage: req.body.Massage,
            Email: req.body.Email
            
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: 'Sent successfully',
            data
        })
    } catch (err) {
        logError("tbmassage.create", err, res)
    }
}

const update = async (req, res) => {
    try {
        var sql =`UPDATE tbmassage SET
        title = :title,Phone =:Phone, Massage = :Massage,Email=:Email
            WHERE id = :id`;
        var param = {
            id: req.body.id,
            title: req.body.title,
            Phone: req.body.Phone,
            Massage: req.body.Massage,
            Email: req.body.Email
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "Update successfully" : "Not found"),
            data
        })
    } catch (err) {
        logError("tbmassage.update", err, res)
    }
}


const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM tbmassage WHERE id = :id"
        var param = {
            id: req.body.id
        
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        })
    } catch (err) {
        logError("tbmassage.remove", err, res)
    }
}


module.exports = {
    getList,
    create,
    update,
    remove,

}
