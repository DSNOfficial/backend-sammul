const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbhistory WHERE 1=1";
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
        logError("tbhistory.getList", err, res);
    }
}

const getOne = async (req, res) => {
    try {
        const sql = "SELECT * FROM tbhistory WHERE Id = :Id";
        const param = {
            Id: req.body.Id
        };
        const [list] = await db.query(sql, param);
        res.json({
            message: 'This is get one route.',
            data: Object.assign(...list)
        });
    } catch (err) {
        logError("tbhistory.getOne", err, res);
    }
}

const create = async (req, res) => {
    try {
        const {  title,description } = req.body;
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
        const sql = "INSERT INTO tbhistory ( title,description, Image) VALUES ( :title, :description,:Image)";
        const param = {
           
            title,
            description,
            Image
        };
        const [data] = await db.query(sql, param);
        res.json({
            data: data
        });
    } catch (err) {
        logError("tbhistory.create", err, res);
    }
}




// const update = async (req, res) => {
//     try {
//         // Extract parameters from the query string
//         const { id, title, description, PreImage } = req.query;
//         let Image = PreImage || ""; // Default to the old image if a new image is not provided

//         // Note: File handling with GET is not supported. This example omits file handling.

//         const message = {}; // Object to hold validation messages

//         // Validate inputs
//         if (isEmptyOrNull(id)) {
//             message.id = "id required!";
//         }
//         // if (isEmptyOrNull(title)) {
//         //     message.title = "title required!";
//         // }

//         // If there are validation errors, return them
//         if (Object.keys(message).length > 0) {
//             res.json({
//                 error: true,
//                 message: message
//             });
//             return;
//         }

//         const param = {
//             id,
//             title,
//             description,
//             Image
//         };

//         // Check if the record exists
//         const [dataInfo] = await db.query("SELECT * FROM tbhistory WHERE id=:id", { id: id });
//         if (dataInfo.length > 0) {
//             // Update the record
//             const sql = "UPDATE tbhistory SET title=:title, description=:description" + (Image ? ", Image=:Image" : "") + " WHERE id = :id";
//             const [data] = await db.query(sql, param);

//             // Send response
//             res.json({
//                 message: (data.affectedRows != 0 ? "Update success" : "Not found"),
//                 data: data
//             });
//         } else {
//             // Record not found
//             res.json({
//                 message: "Not found",
//                 error: true
//             });
//         }
//     } catch (err) {
//         logError("tbhistory.update", err, res); // Log the error
//     }
// };


const update = async (req, res) => {
    try {
        const { id, title ,description} = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename; // Change image | new image
        } else {
            Image = req.body.PreImage; // Get old image
        }
        const message = {}; // Empty object
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
            Image
        };
        const [dataInfo] = await db.query("SELECT * FROM tbhistory WHERE id=:id", { id: id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE tbhistory SET title=:title, Image=:Image,description=:description WHERE id = :id";
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
        logError("tbhistory.update", err, res);
    }
}



const remove = async (req, res) => {
    try {
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbhistory WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbhistory WHERE id = :id";
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
        logError("tbhistory.remove", err, res);
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
