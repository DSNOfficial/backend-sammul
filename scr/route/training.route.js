const training_controller = require("../controller/training.controller");
const { upload } = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");

const training = (app) => {
    app.get("/api/training/getList", training_controller.getList);
    app.post("/api/training/getone", training_controller.getOne);
    app.get("/api/tbtraining_image/:training_id",training_controller.TrainImage);
    app.post(
        "/api/training/create",
        CheckToken(),
        upload.fields([
            { name: 'upload_image', maxCount: 1 },
            { name: 'upload_image_optional', maxCount: 15 }
        ]),
        training_controller.create
    );
    app.put(
        "/api/training/update",
        CheckToken(),
        upload.fields([
            { name: 'upload_image', maxCount: 1 },
            { name: 'upload_image_optional', maxCount: 15 }
        ]),
        training_controller.update
    );
    app.delete("/api/training/delete", CheckToken(), training_controller.remove);
};

module.exports = training;
