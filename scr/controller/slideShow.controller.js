const db = require("../config/db");
const { logError, isEmptyOrNull,removeFile } = require("../config/helper");



const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbshowimage WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR description LIKE :txt_search OR file_path LIKE :txt_search)";
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

const create = async (req, res) => {
    try {
        const { slideId, status, title } = req.body;
        const images = req.files; // Multer stores the array of files in req.files
        let message = {}; // Empty object to hold error messages

        // Validate inputs
        if (isEmptyOrNull(slideId)) {
            message.slideId = "slideId required!";
        }
        if (!images || images.length === 0) {
            message.images = "At least one image is required!";
        }
        if (isEmptyOrNull(status)) {
            message.status = "Status required!";
        }
        if (Object.keys(message).length > 0) {
            res.status(400).json({
                error: true,
                message: message
            });
            return;
        }

        // Prepare SQL statements and parameters
        let sql = "INSERT INTO tbslideshow (slideId, title, status) VALUES (?, ?, ?)";
        const params = [slideId, title, status];

        // Execute the SQL query to create slideshow entry
        const [result] = await db.query(sql, params);
        const slideshowId = result.insertId;

        // Insert images
        if (images && images.length > 0) {
            let imageSql = "INSERT INTO tbslideshow_images (slideshow_id, image) VALUES ";
            let imageParams = [];
            let imagePlaceholders = images.map(() => "(?, ?)").join(", ");

            images.forEach(image => {
                imageParams.push(slideshowId, image.filename);
            });

            imageSql += imagePlaceholders;
            await db.query(imageSql, imageParams);
        }

        res.json({
            message: 'Slideshow created successfully',
            data: result
        });
    } catch (err) {
        logError("tbslideshow.create", err, res);
    }
};

const update = async (req, res) => {
    try {
        const { id, slideId, status, title, imageId } = req.body; // Added imageId to identify which image to update
        const image = req.file; // Multer stores the single file in req.file

        // Validate inputs
        let message = {};
        if (isEmptyOrNull(id)) {
            message.id = "ID required!";
        }
        if (isEmptyOrNull(slideId)) {
            message.slideId = "slideId required!";
        }
        if (isEmptyOrNull(status)) {
            message.status = "Status required!";
        }
        if (isEmptyOrNull(title)) {
            message.title = "Title required!";
        }
        if (image && isEmptyOrNull(imageId)) {
            message.imageId = "Image ID required for updating image!";
        }
        if (Object.keys(message).length > 0) {
            res.status(400).json({
                error: true,
                message: message
            });
            return;
        }

        // Update slideshow details
        const updateSql = `
            UPDATE tbslideshow 
            SET slideId = ?, status = ?, title = ?
            WHERE id = ?
        `;
        const updateParams = [slideId, status, title, id];

        const [data] = await db.query(updateSql, updateParams);

        if (data.affectedRows === 0) {
            res.status(404).json({
                error: true,
                message: "Slideshow not found"
            });
            return;
        }

        // Update image if a new image is provided
        if (image) {
            const deleteImageSql = "DELETE FROM tbslideshow_images WHERE slideshow_id = ? AND id = ?";
            await db.query(deleteImageSql, [id, imageId]);

            const insertImageSql = "INSERT INTO tbslideshow_images (slideshow_id, image) VALUES (?, ?)";
            await db.query(insertImageSql, [id, image.filename]);
        }

        res.json({
            message: "Update successful",
            data
        });
    } catch (err) {
        logError("tbslideshow.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.body;

        if (isEmptyOrNull(id)) {
            res.status(400).json({
                error: true,
                message: { id: "ID required!" }
            });
            return;
        }

        await db.query("DELETE FROM tbslideshow_images WHERE slideshow_id = ?", [id]);
        const sql = "DELETE FROM tbslideshow WHERE id = ?";
        const [data] = await db.query(sql, [id]);

        res.json({
            message: data.affectedRows !== 0 ? "Deleted successfully" : "Not found",
            data
        });
    } catch (err) {
        logError("tbslideshow.remove", err, res);
    }
};








module.exports = {
    getList,
    create,
    update,
    remove,
};
