const mission_controller = require("../controller/mission.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const mission = (app) =>{
 
    app.get("/api/mission/getList",mission_controller.getList);
    app.post("/api/mission/getone",mission_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/mission/create",upload.single("image"),mission_controller.create);
    app.put("/api/mission/update",upload.single("image"),mission_controller.update);
    app.delete("/api/mission/delete",mission_controller.remove);    
}
module.exports = mission;



