
const servicePackage_controller = require("../controller/servicePackage.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const servicePackage = (app) =>{

    app.get("/api/servicePackage/getlist",servicePackage_controller.getList);
    app.post("/api/servicePackage/getone",servicePackage_controller.getOne);
    
    app.post("/api/servicePackage/create",CheckToken(),upload.single("image"),servicePackage_controller.create);
    app.put("/api/servicePackage/update",CheckToken(),upload.single("image"), servicePackage_controller.update);
    app.delete("/api/servicePackage/delete",CheckToken(),servicePackage_controller.remove); 
}
module.exports = servicePackage;
