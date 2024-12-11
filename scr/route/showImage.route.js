
const showImage_controller = require("../controller/showImage.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const showImage = (app) =>{
  
    app.get("/api/showImage/getList",showImage_controller.getList);
    //app.use(CheckToken());
    app.post("/api/showImage/create",upload.single("image"),showImage_controller.create);
    app.put("/api/showImage/update",upload.single("image"),showImage_controller.update);
    app.delete("/api/showImage/delete",showImage_controller.remove);    
}
module.exports = showImage;


