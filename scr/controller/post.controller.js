const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/helper");

// const getList = async (req, res) => {
//     try {
//         const { txt_search } = req.query;
//          var sql ="SELECT e.*,r.Name as RoleName FROM post e "+
//         " INNER JOIN Role r ON e.RoleId = r.id WHERE 1=1"

//         let sql = "SELECT * FROM post WHERE 1=1";
//         let sqlWhere = "";
//         let param = {};

//         if (!isEmptyOrNull(txt_search)) {
//             sqlWhere += " AND (title LIKE :txt_search OR metaTitle LIKE :txt_search OR slug LIKE :txt_search OR content LIKE :txt_search)";
//             param["txt_search"] = `%${txt_search}%`;
//         }

//         sql = sql + sqlWhere + " ORDER BY id DESC";
//         const [list] = await db.query(sql, param);
//         const [category] = await db.query("SELECT * FROM tbdepartment");

//         res.json({
//             list: list,
//             category: category
//         });
//     } catch (err) {
//         logError("post.getList", err, res);
//     }
// }

const getList = async (req, res) => {
    try {

        var {
            txt_search,
            status,
            role_id
        } = req.query;

     

        var sql ="SELECT tbpost.*, users.*, tbdepartment.* FROM tbpost"+
        "INNER JOIN users ON tbpost.userId = users.id"+ 
        "INNER JOIN tbdepartment ON tbpost.departmentId = tbdepartment.id;"


        var param = {}
            if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR metaTitle LIKE :txt_search OR slug LIKE :txt_search OR content LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        if(!isEmptyOrNull(status)){
            sql += " AND e.Status =:status"
            param["status"] = status
        }
        if(!isEmptyOrNull(role_id)){
            sql += " AND e.RoleId =:role_id"
            param["role_id"] = role_id
        }

        const [list] = await db.query(sql,param)
        const [role] = await db.query("SELECT * FROM role")
        const [category] = await db.query("SELECT * FROM tbdepartment");
        res.json({
            message: 'This is listing route.',
            role:role,
            category: category,
            list
        })
    } catch (err) {
        logError("post.getlist", err, res)
    }
}

const getOne = async (req, res) => {
    try {
        const sql = "SELECT * FROM post WHERE id = :id";
        const param = {
            id: req.body.id
        };
        const [list] = await db.query(sql, param);
        res.json({
            message: 'This is get one route.',
            data: Object.assign(...list)
        });
    } catch (err) {
        logError("post.getOne", err, res);
    }
}

const create = async (req, res) => {
    const connection = await db.getConnection(); // Assuming db.getConnection() gets a new database connection
    await connection.beginTransaction();

    try {
        const {

            parentId,
            title,
            metaTitle,
            slug,
            summary,
            published,
            content
        } = req.body;
        let Image = req.file ? req.file.filename : null;
        let message = {};

        if (isEmptyOrNull(title)) message.title = "Title required!";
        if (isEmptyOrNull(metaTitle)) message.metaTitle = "Meta title required!";
        if (isEmptyOrNull(slug)) message.slug = "Slug required!";

        // Check if parentId exists
        if (!isEmptyOrNull(parentId)) {
            const [parentPost] = await connection.query("SELECT id FROM post WHERE id = :parentId", { parentId });
            if (parentPost.length === 0) {
                message.parentId = "Parent post does not exist!";
            }
        }

        if (Object.keys(message).length > 0) {
            await connection.rollback();
            res.json({ error: true, message });
            return;
        }

        const sql = "INSERT INTO post (authorId, categoryId,parentId, title, metaTitle, slug, summary, Image, published, content) VALUES (:authorId, :parentId, :title, :metaTitle, :slug, :summary, :Image, :published, :content)";
        const param = { authorId, parentId, title, metaTitle, slug, summary, Image, published, content,categoryId };
        const [data] = await connection.query(sql, param);

        await connection.commit();
        res.json({
            data: data,
            message: "Post saved successfully!"
        });
    } catch (err) {
        await connection.rollback();
        logError("post.create", err, res);
    } finally {
        connection.release();
    }
}

const update = async (req, res) => {
    const connection = await db.getConnection(); // Assuming db.getConnection() gets a new database connection
    await connection.beginTransaction();

    try {
        const {
            id,
            authorId,
            parentId,
            title,
            metaTitle,
            slug,
            summary,
            published,
            categoryId,
            content
        } = req.body;
        let Image = req.file ? req.file.filename : req.body.PreImage;
        let message = {};

        if (isEmptyOrNull(id)) message.id = "ID required!";
        if (isEmptyOrNull(title)) message.title = "Title required!";
        if (isEmptyOrNull(metaTitle)) message.metaTitle = "Meta title required!";

        // Check if parentId exists
        if (!isEmptyOrNull(parentId)) {
            const [parentPost] = await connection.query("SELECT id FROM post WHERE id = :parentId", { parentId });
            if (parentPost.length === 0) {
                message.parentId = "Parent post does not exist!";
            }
        }

        if (Object.keys(message).length > 0) {
            await connection.rollback();
            res.json({ error: true, message });
            return;
        }

        const param = { id, authorId, parentId, title, metaTitle, slug, summary, Image, published, content };
        const [dataInfo] = await connection.query("SELECT * FROM post WHERE id=:id", { id });

        if (dataInfo.length > 0) {
            const sql = "UPDATE post SET authorId=:authorId, parentId=:parentId, title=:title, slug=:slug, metaTitle=:metaTitle, summary=:summary, Image=:Image, published=:published, content=:content WHERE id=:id";
            const [data] = await connection.query(sql, param);

            if (data.affectedRows && req.file && !isEmptyOrNull(req.body.PreImage)) {
                await removeFile(req.body.PreImage);
            }

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
        logError("post.update", err, res);
    } finally {
        connection.release();
    }
}


const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const [dataInfo] = await db.query("SELECT * FROM post WHERE id=:id", { id });

        if (dataInfo.length > 0) {
            const sql = "DELETE FROM post WHERE id=:id";
            const [data] = await db.query(sql, { id });

            if (data.affectedRows && dataInfo[0].Image) {
                await removeFile(dataInfo[0].Image);
            }

            res.json({
                message: data.affectedRows ? "Remove successful" : "Not found",
                data: data
            });
        } else {
            res.json({ message: "Not found", error: true });
        }
    } catch (err) {
        logError("post.remove", err, res);
    }
}

module.exports = {
    getList,
    create,
    update,
    remove,
    getOne,
}
