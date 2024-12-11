
const partner_controller = require("../controller/partner.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const partner = (app) =>{
 
    app.get("/api/partner/getList",partner_controller.getList);
    app.post("/api/partner/getone",partner_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/partner/create",upload.single("image"),partner_controller.create);
    app.put("/api/partner/update",upload.single("image"),partner_controller.update);
    app.delete("/api/partner/delete",partner_controller.remove);    
}
module.exports = partner;


