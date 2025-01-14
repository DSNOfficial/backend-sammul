
const technical_controller = require("../controller/tbtechnical.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const technical = (app) =>{
 
    app.get("/api/technical/getList",technical_controller.getList);
    app.post("/api/technical/getone",technical_controller.getOne);
   
    app.post("/api/technical/create",CheckToken(),upload.single("image"),technical_controller.create);
    app.put("/api/technical/update",CheckToken(),upload.single("image"),technical_controller.update);
    app.delete("/api/technical/delete",CheckToken(),technical_controller.remove);    
}
module.exports = technical;


