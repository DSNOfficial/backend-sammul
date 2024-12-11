const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");


const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbshowimage WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR createdAt LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        

    
        res.json({
            list: list,
        });
    } catch (err) {
        logError("tbshowimage.getList", err, res);
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
        logError("product.getOne", err, res);
    }
}

const create = async (req, res) => {
    try {
        const {  title } = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename;
        }
        const message = {}; // Empty object
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        // if (isEmptyOrNull(content)) {
        //     message.content = "content required!";
        // }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const sql = "INSERT INTO tbshowimage ( title, Image) VALUES ( :title, :Image)";
        const param = {
           
            title,
            Image
        };
        const [data] = await db.query(sql, param);
        res.json({
            data: data
        });
    } catch (err) {
        logError("tbshowimage.create", err, res);
    }
}

const update = async (req, res) => {
    try {
        const { id, title } = req.body;
        let Image = req.body.PreImage || ""; // Default to the old image if a new image is not provided

        if (req.file) {
            Image = req.file.filename; // Use the new image if uploaded
        }

        const message = {}; // Object to hold validation messages

        // Validate inputs
        if (isEmptyOrNull(id)) {
            message.id = "id required!";
        }
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }

        // If there are validation errors, return them
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return;
        }

        const param = {
            id,
            title,
            Image
        };

        // Check if the record exists
        const [dataInfo] = await db.query("SELECT * FROM tbshowimage WHERE id=:id", { id: id });
        if (dataInfo.length > 0) {
            // Update the record
            const sql = "UPDATE tbshowimage SET title=:title" + (req.file ? ", Image=:Image" : "") + " WHERE id = :id";
            const [data] = await db.query(sql, param);

            // If update was successful and a new image was provided, remove the old image file
            if (data.affectedRows) {
                if (req.file && !isEmptyOrNull(req.body.PreImage)) {
                    await removeFile(req.body.PreImage); // Remove old file
                }
            }

            // Send response
            res.json({
                message: (data.affectedRows != 0 ? "Update success" : "Not found"),
                data: data
            });
        } else {
            // Record not found
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbshowimage.update", err, res); // Log the error
    }
}

const remove = async (req, res) => {
    try {
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbshowimage WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbshowimage WHERE id = :id";
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
        logError("tbshowimage.remove", err, res);
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
