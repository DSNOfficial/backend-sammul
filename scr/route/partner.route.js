
const partner_controller = require("../controller/partner.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const partner = (app) =>{
 
    app.get("/api/partner/getList",partner_controller.getList);
    app.post("/api/partner/getone",partner_controller.getOne);
   
    app.post("/api/partner/create",CheckToken(),upload.single("image"),partner_controller.create);
    app.put("/api/partner/update",CheckToken(),upload.single("image"),partner_controller.update);
    app.delete("/api/partner/delete",CheckToken(),partner_controller.remove);    
}
module.exports = partner;


