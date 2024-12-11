
const visionH_controller = require("../controller/visionH.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const visionH = (app) =>{
 
    app.get("/api/vision/getList",visionH_controller.getList);
    app.post("/api/vision/getone",visionH_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/vision/create",upload.single("image"),visionH_controller.create);
    app.put("/api/vision/update",upload.single("image"),visionH_controller.update);
    app.delete("/api/vision/delete",visionH_controller.remove);    
}
module.exports = visionH;


