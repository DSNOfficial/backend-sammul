
const administration_controller = require("../controller/tbadministration.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const administration = (app) =>{
 
    app.get("/api/administration/getList",administration_controller.getList);
    app.post("/api/administration/getone",administration_controller.getOne);
   
    app.post("/api/administration/create",CheckToken(),upload.single("image"),administration_controller.create);
    app.put("/api/administration/update",CheckToken(),upload.single("image"),administration_controller.update);
    app.delete("/api/administration/delete",CheckToken(),administration_controller.remove);    
}
module.exports = administration;


