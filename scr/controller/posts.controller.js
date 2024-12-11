const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT p.id, p.title, p.content, GROUP_CONCAT(ph.filename) AS photos
            FROM posts p
            LEFT JOIN post_photos pp ON p.id = pp.post_id
            LEFT JOIN photos ph ON pp.photo_id = ph.id
            WHERE p.id = ?
            GROUP BY p.id;
        `;
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to retrieve post.');
            }
            if (results.length === 0) {
                return res.status(404).send('Post not found.');
            }
            res.json(results[0]);
        });
    } catch (err) {
        logError("posts.getOne", err, res);
        res.status(500).send('Server error.');
    }
};

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = `
            SELECT p.id, p.title, p.content, GROUP_CONCAT(ph.filename) AS photos
            FROM posts p
            LEFT JOIN post_photos pp ON p.id = pp.post_id
            LEFT JOIN photos ph ON pp.photo_id = ph.id
            WHERE 1=1
        `;
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (p.title LIKE :txt_search OR p.content LIKE :txt_search OR ph.filename LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " GROUP BY p.id ORDER BY p.id DESC";
        const [list] = await db.query(sql, param);

        res.json({ list });
    } catch (err) {
        logError("posts.getList", err, res);
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
};

const create = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
            const postId = result.insertId;

            if (req.files && req.files.length > 0) {
                const photos = req.files.map(file => [file.filename]);
                const [photoResult] = await connection.query('INSERT INTO photos (filename) VALUES ?', [photos]);
                const photoIds = photoResult.insertId;

                const postPhotos = req.files.map((file, index) => [postId, photoIds + index]);
                await connection.query('INSERT INTO post_photos (post_id, photo_id) VALUES ?', [postPhotos]);
            }

            await connection.commit();
            res.send('Post and photos uploaded successfully.');
        } catch (err) {
            await connection.rollback();
            logError('Create Post Error:', err);
            next(err);
        } finally {
            connection.release();
        }
    } catch (err) {
        logError("posts.create", err, res);
        res.status(500).send('Server error.');
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Update post details
            const [updateResult] = await connection.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);
            if (updateResult.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).send('Post not found.');
            }

            if (req.files && req.files.length > 0) {
                // Delete existing photos
                const [existingPhotos] = await connection.query('SELECT ph.filename, ph.id FROM post_photos pp LEFT JOIN photos ph ON pp.photo_id = ph.id WHERE pp.post_id = ?', [id]);
                const existingPhotoIds = existingPhotos.map(photo => photo.id);
                if (existingPhotoIds.length > 0) {
                    await connection.query('DELETE FROM post_photos WHERE post_id = ?', [id]);
                    await connection.query('DELETE FROM photos WHERE id IN (?)', [existingPhotoIds]);
                    // Remove existing photo files
                    existingPhotos.forEach(photo => {
                        removeFile(photo.filename);
                    });
                }

                // Insert new photos
                const photos = req.files.map(file => [file.filename]);
                const [photoResult] = await connection.query('INSERT INTO photos (filename) VALUES ?', [photos]);
                const photoIds = Array.from({ length: req.files.length }, (_, index) => photoResult.insertId + index);

                // Link new photos with post
                const postPhotos = photoIds.map(photoId => [id, photoId]);
                await connection.query('INSERT INTO post_photos (post_id, photo_id) VALUES ?', [postPhotos]);
            }

            await connection.commit();
            res.send('Post and photos updated successfully.');
        } catch (err) {
            await connection.rollback();
            console.error('Update Post Error:', err);
            next(err);
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("posts.update", err);
        res.status(500).send('Server error.');
    }
};



const remove = async (req, res, next) => {
    try {
        const { id } = req.params;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Fetch photos to delete them from the file system
            const [photos] = await connection.query('SELECT ph.filename, ph.id FROM post_photos pp LEFT JOIN photos ph ON pp.photo_id = ph.id WHERE pp.post_id = ?', [id]);
            if (photos.length === 0) {
                await connection.rollback();
                return res.status(404).send('Post not found.');
            }

            // Delete post photos relationship
            await connection.query('DELETE FROM post_photos WHERE post_id = ?', [id]);
            // Delete photos from the photos table
            const photoIds = photos.map(photo => photo.id);
            await connection.query('DELETE FROM photos WHERE id IN (?)', [photoIds]);
            // Delete the post
            const [deleteResult] = await connection.query('DELETE FROM posts WHERE id = ?', [id]);
            if (deleteResult.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).send('Post not found.');
            }

            await connection.commit();

            // Remove files from the file system
            photos.forEach(photo => {
                removeFile(photo.filename);
            });

            res.send('Post deleted successfully.');
        } catch (err) {
            await connection.rollback();
            console.error('Delete Post Error:', err);
            next(err);
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("posts.remove", err);
        res.status(500).send('Server error.');
    }
};



module.exports = {
    create,
    getList,
    getOne,
    update,
    remove,
};
