
const manyImages_controller = require("../controller/manyImages.controller");
const { CheckToken } = require("../controller/user.controller");
const {upload} = require("../config/helper");

const manyImages = (app) =>{

    app.get("/api/manyImages/getList",manyImages_controller.getlist);
    app.get("/api/manyImages/getOne",manyImages_controller.getone);

    app.post("/api/manyImages/create",CheckToken(),upload.array("images",10),manyImages_controller.create);
    app.put("/api/manyImages/update",CheckToken(),upload.single('image'),manyImages_controller.update);
    app.delete("/api/manyImages/delete",CheckToken(),manyImages_controller.remove); 

}
module.exports = manyImages;
