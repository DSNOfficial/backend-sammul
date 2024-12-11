
const valueH_controller = require("../controller/valueH.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const valueH = (app) =>{
 
    app.get("/api/values/getList",valueH_controller.getList);
    app.post("/api/values/getone",valueH_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/values/create",upload.single("image"),valueH_controller.create);
    app.put("/api/values/update",upload.single("image"),valueH_controller.update);
    app.delete("/api/values/delete",valueH_controller.remove);    
}
module.exports = valueH;


