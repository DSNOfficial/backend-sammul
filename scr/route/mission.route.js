const mission_controller = require("../controller/mission.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const mission = (app) =>{
 
    app.get("/api/mission/getList",mission_controller.getList);
    app.post("/api/mission/getone",mission_controller.getOne);
 
    app.post("/api/mission/create",CheckToken(),upload.single("upload_image"),mission_controller.create);
    app.put("/api/mission/update",CheckToken(),upload.single("upload_image"),mission_controller.update);
    app.delete("/api/mission/delete",CheckToken(),mission_controller.remove);    
}
module.exports = mission;



