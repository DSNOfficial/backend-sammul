const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");


const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbbook WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR description LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);



        res.json({
            list: list,
        });
    } catch (err) {
        logError("tbbook.getList", err, res);
    }
}

const getOne = async (req, res) => {
    try {
        const sql = "SELECT * FROM tbbook WHERE Id = :Id";
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

// const create = async (req, res) => {
//     try {
//         const { title, description } = req.body;
//         let file_path = null;
//         if (req.file) {
//             file_path = req.file.filename;
//         }
//         const message = {}; // Empty object
//         if (isEmptyOrNull(title)) {
//             message.title = "title required!";
//         }
//         if (isEmptyOrNull(description)) {
//             message.description = "description required!";
//         }
//         if (Object.keys(message).length > 0) {
//             res.json({
//                 error: true,
//                 message: message
//             });
//             return false;
//         }
//         const sql = "INSERT INTO tbbook ( title,description, file_path) VALUES ( :title,:description, :file_path)";
//         const param = {

//             title,
//             description,
//             file_path
//         };
//         const [data] = await db.query(sql, param);
//         res.json({
//             data: data
//         });
//     } catch (err) {
//         logError("tbbook.create", err, res);
//     }
// }

const create = async (req, res) => {
    try {
        const { title, description } = req.body;
        let file_path = null;

        if (req.file) {
            file_path = req.file.filename;
        }

        const message = {}; // Empty object for validation messages

        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }

        if (isEmptyOrNull(description)) {
            message.description = "description required!";
        }

        if (Object.keys(message).length > 0) {
            res.status(400).json({
                error: true,
                message: message
            });
            return;
        }

        const sql = "INSERT INTO tbbook (title, description, file_path) VALUES (:title, :description, :file_path)";
        const param = {
            title,
            description,
            file_path
        };

        const [data] = await db.query(sql, param);

        res.status(201).json({
            message: "Book created successfully",
            data: data
        });
    } catch (err) {
        logError("tbbook.create", err, res);
    }
}


const update = async (req, res) => {
    try {
        const { id, title, description, PreImage } = req.body;
        let file_path = PreImage; // Default to previous image

        if (req.file) {
            file_path = req.file.filename; // Use new image if uploaded
        }

        const message = {}; // Empty object for validation messages
        if (isEmptyOrNull(id)) {
            message.id = "id required!";
        }
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        if (isEmptyOrNull(description)) {
            message.description = "description required!";
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
            title,
            description,
            file_path
        };

        const [dataInfo] = await db.query("SELECT * FROM tbbook WHERE id = :id", { id: id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE tbbook SET title = :title, description = :description, file_path = :file_path WHERE id = :id";
            const [data] = await db.query(sql, param);

            if (data.affectedRows) {
                if (req.file && PreImage) {
                    await removeFile(PreImage); // Remove old file if new file is uploaded
                }
                res.json({
                    message: "Update success",
                    data: data
                });
            } else {
                res.json({
                    message: "Update failed",
                    error: true
                });
            }
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbbook.update", err, res);
    }
}



const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const param = { id };

        const [dataInfo] = await db.query("SELECT * FROM tbbook WHERE id = :id", param);

        if (dataInfo.length > 0) {
            const filePath = dataInfo[0].file_path; // Assuming file path is stored in file_path column

            const sql = "DELETE FROM tbbook WHERE id = :id";
            const [data] = await db.query(sql, param);

            if (data.affectedRows) {
                if (filePath) {
                    try {
                        await removeFile(filePath); // Remove the file
                    } catch (fileErr) {
                        logError("tbbook.removeFile", fileErr, res); // Log file removal error
                    }
                }

                res.json({
                    message: "Remove success",
                    data: data
                });
            } else {
                res.json({
                    message: "Remove failed",
                    error: true
                });
            }
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbbook.remove", err, res);
    }
}


module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
