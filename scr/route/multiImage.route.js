
const multiImage_controller = require("../controller/multiImage.controller");
const { CheckToken } = require("../controller/user.controller");
const {upload_multi} = require("../config/helper");

upload_multi
const multiImage = (app) =>{

    app.get("/api/multiImage/getList",multiImage_controller.getlist);

    app.post("/api/multiImage/create",CheckToken(),upload_multi.array("images",10),multiImage_controller.create);
    app.put("/api/multiImage/update",CheckToken(),upload_multi.array("image",10),multiImage_controller.update);
    app.delete("/api/multiImage/delete",CheckToken(),multiImage_controller.remove); 

}
module.exports = multiImage;
