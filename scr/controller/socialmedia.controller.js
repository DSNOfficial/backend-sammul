const db = require("../config/db");
const { logError } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM tbsocialmedia")
        res.json({
            message: 'This is listing route.',
            list,
            userThatRequested:req.user
        })
    } catch (err) {
        logError("tbsocialmedia.getList", err, res)
    }
}
//	id	parentId	title	metaTitle	slug	content
const create = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const {
            parentId,
            title,
            metaTitle,
            slug,
            content
        } = req.body;

        let message = {};

        if (isEmptyOrNull(title)) message.title = "Title required!";
        if (isEmptyOrNull(slug)) message.slug = "Slug required!";

        // Check if parentId exists
        if (!isEmptyOrNull(parentId)) {
            const [parentCategory] = await connection.query("SELECT id FROM category WHERE id = :parentId", { parentId });
            if (parentCategory.length === 0) {
                message.parentId = "Parent category does not exist!";
            }
        }

        if (Object.keys(message).length > 0) {
            await connection.rollback();
            res.json({ error: true, message });
            return;
        }

        const sql = "INSERT INTO category (parentId, title, metaTitle, slug, content) VALUES (:parentId, :title, :metaTitle, :slug, :content)";
        const param = { parentId, title, metaTitle, slug, content };
        const [data] = await connection.query(sql, param);

        await connection.commit();
        res.json({
            data: data,
            message: "Category saved successfully!"
        });
    } catch (err) {
        await connection.rollback();
        logError("category.create", err, res);
    } finally {
        connection.release();
    }
}


const update = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const {
            id,
            parentId,
            title,
            metaTitle,
            slug,
            content
        } = req.body;

        let message = {};

        if (isEmptyOrNull(id)) message.id = "ID required!";
        if (isEmptyOrNull(title)) message.title = "Title required!";
        if (isEmptyOrNull(slug)) message.slug = "Slug required!";

        // Check if parentId exists
        if (!isEmptyOrNull(parentId)) {
            const [parentCategory] = await connection.query("SELECT id FROM category WHERE id = :parentId", { parentId });
            if (parentCategory.length === 0) {
                message.parentId = "Parent category does not exist!";
            }
        }

        if (Object.keys(message).length > 0) {
            await connection.rollback();
            res.json({ error: true, message });
            return;
        }

        const param = { id, parentId, title, metaTitle, slug, content };
        const [dataInfo] = await connection.query("SELECT * FROM category WHERE id = :id", { id });

        if (dataInfo.length > 0) {
            const sql = "UPDATE category SET parentId = :parentId, title = :title, metaTitle = :metaTitle, slug = :slug, content = :content WHERE id = :id";
            const [data] = await connection.query(sql, param);

            await connection.commit();
            res.json({
                message: data.affectedRows ? "Update successful" : "Not found",
                data: data
            });
        } else {
            await connection.rollback();
            res.json({ message: "Not found", error: true });
        }
    } catch (err) {
        await connection.rollback();
        logError("category.update", err, res);
    } finally {
        connection.release();
    }
}


const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM category WHERE id = :id"
        var param = {
            id: req.body.id
        
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "Delete successfully" : "Not found",
            data
        })
    } catch (err) {
        logError("category.remove", err, res)
    }
}


module.exports = {
    getList,
    create,
    update,
    remove,

}