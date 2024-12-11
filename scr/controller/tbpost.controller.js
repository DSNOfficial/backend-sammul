const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");




const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;

        let sql = "SELECT * FROM tbpost WHERE 1=1";
        let sqlWhere = "";
     
        let param = {};
        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR content LIKE :txt_search OR summary LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }
        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        const [category] = await db.query("SELECT * FROM tbdepartment");
        const [user] = await db.query("SELECT * FROM users");

        console.log("Fetched users:", user); // Debugging log

        res.json({
            list: list,
            category: category,
            user: user
        });
    } catch (err) {
        logError("tbpost.getList", err, res);
    }
}


const getOne = async (req, res) => {
    try {
        const sql = "SELECT * FROM product WHERE Id = :Id";
        const param = {
            Id: req.body.Id
        };
        const [list] = await db.query(sql, param);
        res.json({
            message: 'This is get one route.',
            data: Object.assign(...list)
        });
    } catch (err) {
        logError("tbpost.getOne", err, res);
    }
}

const create = async (req, res) => {
    try {
        const { userId, departmentId, title, content, summary } = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename;
        }
        const message = {}; // Empty object
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        if (isEmptyOrNull(content)) {
            message.content = "content required!";
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const sql = "INSERT INTO tbpost (userId, departmentId, title, content, summary, Image) VALUES (:userId, :departmentId, :title, :content, :summary, :Image)";
        const param = {
            userId,
            departmentId,
            title,
            content,
            summary,
            Image
        };
        const [data] = await db.query(sql, param);
        res.json({
            data: data
        });
    } catch (err) {
        logError("tbpost.create", err, res);
    }
}

const update = async (req, res) => {
    try {
        const { id, userId, departmentId, title, content, summary } = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename; // Change image | new image
        } else {
            // PreImage = req.body.Image; // Get old 
            Image = req.body.PreImage; // Get old imag    

        }
        const message = {}; // Empty object
        if (isEmptyOrNull(id)) {
            message.id = "id required!";
        }
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        if (isEmptyOrNull(content)) {
            message.content = "content required!";
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const param = {
            id,
            userId,
            departmentId,
            title,
            content,
            summary,
            Image
        };
        const [dataInfo] = await db.query("SELECT * FROM tbpost WHERE id=:id", { id: id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE tbpost SET userId=:userId, departmentId=:departmentId, title=:title, content=:content, summary=:summary, Image=:Image WHERE id = :id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                if (req.file && !isEmptyOrNull(req.body.Image)) {
                    await removeFile(req.body.Image); // Remove old file
                }
            }
            res.json({
                message: (data.affectedRows != 0 ? "Update success" : "Not found"),
                data: data
            });
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbpost.update", err, res);
    }
}

const remove = async (req, res) => {
    try {
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbpost WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbpost WHERE id = :id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                // If delete success then unlink | remove file
                await removeFile(dataInfo[0].Image); // Get image from
            }
            res.json({
                message: data.affectedRows != 0 ? "Remove success" : "Not found",
                data: data
            });
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbpost.remove", err, res);
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
