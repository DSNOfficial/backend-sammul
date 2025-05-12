const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");
//const decode = require("decode-uri-component");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbvalue WHERE 1=1";
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
        logError("tbvalue.getList", err, res);
    }
}

const getOne = async (req, res) => {
    try {
      const sql = "SELECT * FROM tbvalue WHERE id = :id";
      const param = {
        id: req.body.id  // Accessing the ID from URL parameters
      };
      const [result] = await db.query(sql, param);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Vision post not found' });
      }
  
      res.json({
        message: 'Vision post fetched successfully',
        data: result[0]
      });
    } catch (err) {
      logError("tbvalue.getOne", err, res);
    }
  }
  

const create = async (req, res) => {
    try {
        const sql = `
            INSERT INTO tbvalue (Title, Description,image)
            VALUES (:Title, :Description, :image)
        `;
        var [data] = await db.query(sql, {
             ...req.body,          
           image: req.file?.filename || null || "null" || "",
           
        });
         
        res.json({
            data,
            message: "Insert Success"


        });


    } catch (err) {
        logError("tbvalue.create", err, res);
    }
};



const update = async (req, res) => {
    try {

        var sql = "UPDATE tbvalue SET  Title=:Title, image=:image,Description=:Description WHERE id = :id";
        var filename = req.body?.image;
        /// new image
        if (req.file) {
            filename = req.file?.filename;
        }
        //image change for single image
        if (
            req.body.image != "" &&
            req.body.image != null &&
            req.body.image != "null" &&

            req.file?.upload_image
        ) {
            removeFile(req.body.image); // remove old image
            filename = req.file?.filename;
        }

        /// image remove
        if (req.body.image_remove == "1") {
            removeFile(req.body.image); // remove image
            filename = null;
        }



        var [data] = await db.query(sql, {
            ...req.body,
            image: filename,

        });

        res.json({
            data,
            message: "Update Success"


        });
     

    } catch (err) {
        logError("tbtraining.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        let Image = null || "" || "null";
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbvalue WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbvalue WHERE id = :id";
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
        logError("tbvalue.remove", err, res);
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
