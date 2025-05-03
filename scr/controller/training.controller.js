const bodyParser = require("body-parser");
const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbtraining WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (title LIKE :txt_search OR description LIKE :txt_search OR Status LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);



        res.json({
            list: list,
        });
    } catch (err) {
        logError("tbtraining.getList", err, res);
    }
}
// Route: GET /api/train/:id

const TrainImage = async (req, res) => {
    try {

        var sql = "SELECT * FROM tbtraining_image WHERE training_id =:training_id";

        var [list] = await db.query(sql, {
            training_id: req.params.training_id,
        });
        res.json({
            list,
        });

    } catch (err) {
        logError("tbtraining.TrainImage", err, res);
    }
};

const getOne = async (req, res) => {
    try {
        const id = req.body.id || req.params.id; // support both body and param

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'Training ID is required' });
        }

        // Fetch main training record
        const sqlTraining = "SELECT * FROM tbtraining WHERE id = :id";
        const [trainingResult] = await db.query(sqlTraining, { id });

        if (!trainingResult || trainingResult.length === 0) {
            return res.status(404).json({ message: 'Training record not found' });
        }

        // Fetch related images
        const sqlImages = "SELECT image FROM tbtraining_image WHERE training_id = :id";
        const [imagesResult] = await db.query(sqlImages, { id });

        // Return full training data with images
        res.json({
            message: 'Training record fetched successfully',
            data: {
                ...trainingResult[0],
                images: imagesResult.map(img => img.image), // return only filenames
            }
        });
    } catch (err) {
        logError("tbtraining.getOne", err, res);
    }
};



  

const create = async (req, res) => {
    try {

        const sql = `
            INSERT INTO tbtraining (title, description, status, image)
            VALUES (:title, :description, :status, :image)
        `;
        var [data] = await db.query(sql, {

            ...req.body,
            //image: req.files?.upload_image[0].filename,
            image: req.files?.upload_image?.[0]?.filename || null
        });

        if (req.files && req.files?.upload_image_optional) {
            var ParaImageTrain = [];
            req.files?.upload_image_optional.map((item, index) => {
                ParaImageTrain.push([data?.insertId, item.filename]);
            })
            var slqTrainImage = "INSERT INTO tbtraining_image (training_id,image) VALUES :data";
            var [dataImage] = await db.query(slqTrainImage, {
                data: ParaImageTrain,
            });

        }
        res.json({
            data,
            message: "Insert Success"


        });


    } catch (err) {
        logError("tbtraining.create", err, res);
    }
};

const update = async (req, res) => {
    try {

        var sql = "UPDATE tbtraining SET  title=:title, image=:image,description=:description,status=:status WHERE id = :id";
        var filename = req.body.image;
        /// new image
        if (req.files?.upload_image) {
            filename = req.files?.upload_image[0]?.filename;
        }
        //image change for single image
        if (
            req.body.image != "" &&
            req.body.image != null &&
            req.body.image != "null" &&
            req.files?.upload_image
        ) {
            removeFile(req.body.image); // remove old image
            filename = req.files?.upload_image[0]?.filename;
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

        //image optional 

        if (req.files && req.files?.upload_image_optional) {
            var ParaImageTrain = [];
            req.files?.upload_image_optional.map((item, index) => {
                ParaImageTrain.push([req.body.id, item.filename]);
            })
            var slqTrainImage = "INSERT INTO tbtraining_image (training_id,image) VALUES :data";
            var [dataImage] = await db.query(slqTrainImage, {
                data: ParaImageTrain,
            });

        }

        // multiple image

        // console.log(req.body.image_optional);

        if (req.body.image_optional && req.body.image_optional.length > 0) {

            //console.log(req.body.image_optional);
            if (typeof req.body.image_optional == "string") {
                req.body.image_optional = [req.body.image_optional];
            }
            req.body.image_optional.map(async (item, index) => {
                // remove database

                let [data] = await db.query("DELETE FROM tbtraining_image WHERE image =:image",
                    { image: item }
                );


                // unlink from hard
                removeFile(item);

            });

            image_optional = [
                {
                    isFound: false, // true | false
                    name: "",
                    status: "removed",
                    uid: "",
                    url: ""
                },
            ];

        }

        res.json({
            message: (data.affectedRows != 0 ? "Update success" : "Not found"),
            data: data
        });

    } catch (err) {
        logError("tbtraining.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        const param = {
            id: req.body.id
        };
        const [dataInfo] = await db.query("SELECT * FROM tbtraining WHERE id=:id", param);
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM tbtraining WHERE id = :id";
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
        logError("tbtraining.remove", err, res);
    }
};

module.exports = {
    getList,
    getOne,
    create,
    update,
    TrainImage,
    remove
};


