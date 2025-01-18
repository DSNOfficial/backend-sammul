const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbdepartment WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (Title LIKE :txt_search OR Description LIKE :txt_search OR Content LIKE :txt_search OR Name LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        
        res.json({
            list: list,
        });
    } catch (err) {
        logError("tbdepartment.getList", err, res);
    }
}



const getOne = async (req, res) => {
    try {
      const sql = "SELECT * FROM tbdepartment WHERE id = :id";
      const param = {
        id: req.body.id  // Accessing the ID from URL parameters
      };
      const [result] = await db.query(sql, param);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.json({
        message: 'Blog post fetched successfully',
        data: result[0]
      });
    } catch (err) {
      logError("tbdepartment.getOne", err, res);
    }
  }
  

const create = async (req, res) => {
    try {
        const { Title,Name,Description,Status,Content,timeCheck} = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename;
        }
        const message = {}; // Empty object
        if (isEmptyOrNull(Title)) {
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
        const sql = "INSERT INTO tbdepartment ( Title,Name,Description,Status,Content,Image,timeCheck) VALUES ( :Title,:Name,:Description,:Status,:Content,:Image,:timeCheck)";
        const param = {
           
            Title,
            Name,
            Description,
            Status,
            Content,
            Image,
            timeCheck
        };
        const [data] = await db.query(sql, param);
        res.json({
            data: data
        });
    } catch (err) {
        logError("tbdepartment.create", err, res);
    }
}

const update = async (req, res) => {
    try {
        const { id, Name,Title ,Description,Status, Content,timeCheck} = req.body;
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
        if (isEmptyOrNull(Title)) {
            message.title = "title required!";
        }
        if (isEmptyOrNull(Description)) {
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
            Title,
            Name,
            Description,
            Status,
            Content,
            Image,
            timeCheck
        };
        const [dataInfo] = await db.query("SELECT * FROM tbdepartment WHERE id=:id", { id: id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE tbdepartment SET timeCheck=:timeCheck, Name=:Name, Content=:Content, Title=:Title, Image=:Image,Description=:Description,Status=:Status WHERE id = :id";
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
        logError("tbdepartment.update", err, res);
    }
}

const remove = async (req, res) => {
    try {
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbdepartment WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbdepartment WHERE id = :id";
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
        logError("tbdepartment.remove", err, res);
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
