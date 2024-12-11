const db = require("../config/db");
const bodyParser = require('body-parser');
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbmassage WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR Email LIKE :txt_search OR Phone LIKE :txt_search OR Email LIKE :txt_search OR Massage LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);

        res.json({
            list: list,
            userThatRequested: req.user
        });
    } catch (err) {
        logError("tbmassage.getList", err, res);
    }
}
// const sql = "INSERT INTO tbmassage (title, Email, Phone, Massage, Email) VALUES (:title, :Email, :Phone, :Massage, :Email)";


const create = async (req, res) => {
    try {
        const {  title,Phone, Email,Massage} = req.body;
      
        const message = {}; // Empty object
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        if (isEmptyOrNull(Phone)) {
            message.Phone = "Phone required!";
        }
        if (isEmptyOrNull(Email)) {
            message.Email = "Email required!";
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const sql = "INSERT INTO tbmassage ( title,Email, Phone,Massage) VALUES ( :title, :Email,:Phone,:Massage)";
        const param = {
           
            title,
            Email,
            Phone,
            Massage,
        };
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "sent successfully" : "Not found"),

            data: data
        });
    } catch (err) {
        logError("tbmassage.create", err, res);
    }
}

const update = async (req, res) => {
    try {
        var sql =`UPDATE tbmassage SET
        title = :title,Email =:Email, Phone = :Phone,Massage=:Massage
            WHERE id = :id`;
        var param = {
            id: req.body.id,
            title: req.body.title,
            Email: req.body.Email,
            Massage:req.body.Massage,
            Phone: req.body.Phone
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
};
