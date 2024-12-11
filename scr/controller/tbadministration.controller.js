const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbadministration WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR description LIKE :txt_search OR Status LIKE :txt_search OR code LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);

        res.json({ list });
    } catch (err) {
        logError("tbadministration.getList", err, res);
    }
};

const getOne = async (req, res) => {
    try {
        const sql = "SELECT * FROM tbadministration WHERE id = :id";
        const param = { id: req.params.id }; // Accessing the ID from URL parameters
        const [result] = await db.query(sql, param);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json({ message: 'Blog post fetched successfully', data: result[0] });
    } catch (err) {
        logError("tbadministration.getOne", err, res);
    }
};

const create = async (req, res) => {
    try {
        const { title, description, Status } = req.body;
        let Image = null;
        if (req.file) {
            Image = req.file.filename;
        }
        const message = {}; // Empty object
        if (isEmptyOrNull(title)) {
            message.title = "title required!";
        }
        if (Object.keys(message).length > 0) {
            res.json({ error: true, message });
            return;
        }

        // Generate code
        const currentYear = new Date().getFullYear();
        const [lastItem] = await db.query("SELECT code FROM tbadministration ORDER BY id DESC LIMIT 1");
        let nextCode = 1;
        if (lastItem.length > 0) {
            const lastYear = parseInt(lastItem[0].code.split('-')[2]);
            if (lastYear === currentYear) {
                nextCode = parseInt(lastItem[0].code.split('-')[1]) + 1;
            }
        }
        const code = `TSNH-${String(nextCode).padStart(3, '0')}-${currentYear}`;

        const sql = "INSERT INTO tbadministration (title, description, Status, Image, code) VALUES (:title, :description, :Status, :Image, :code)";
        const param = { title, description, Status, code, Image };
        const [data] = await db.query(sql, param);
        res.json({ data });
    } catch (err) {
        logError("tbadministration.create", err, res);
    }
};

const update = async (req, res) => {
    try {
        const { id, title, description, Status} = req.body;
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
            res.json({ error: true, message });
            return;
        }

        // Generate code
        const currentYear = new Date().getFullYear();
        const [lastItem] = await db.query("SELECT code FROM tbadministration WHERE id != :id ORDER BY id DESC LIMIT 1", { id });
        let nextCode = 1;
        if (lastItem.length > 0) {
            const lastYear = parseInt(lastItem[0].code.split('-')[2]);
            if (lastYear === currentYear) {
                nextCode = parseInt(lastItem[0].code.split('-')[1]) + 1;
            }
        }
        const code = `TSNH-${String(nextCode).padStart(3, '0')}-${currentYear}`;

        const param = { id, title, description, Status, code, Image };
        const [dataInfo] = await db.query("SELECT * FROM tbadministration WHERE id = :id", { id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE tbadministration SET title = :title, Image = :Image, description = :description, Status = :Status, code = :code WHERE id = :id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows && req.file && !isEmptyOrNull(req.body.Image)) {
                await removeFile(req.body.Image); // Remove old file
            }
            res.json({ message: data.affectedRows !== 0 ? "Update success" : "Not found", data });
        } else {
            res.json({ message: "Not found", error: true });
        }
    } catch (err) {
        logError("tbadministration.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        const param = { id: req.body.id };
        const [dataInfo] = await db.query("SELECT * FROM tbadministration WHERE id = :id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbadministration WHERE id = :id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                // If delete success then unlink | remove file
                await removeFile(dataInfo[0].Image); // Get image from
            }
            res.json({ message: data.affectedRows !== 0 ? "Remove success" : "Not found", data });
        } else {
            res.json({ message: "Not found", error: true });
        }
    } catch (err) {
        logError("tbadministration.remove", err, res);
    }
};

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
