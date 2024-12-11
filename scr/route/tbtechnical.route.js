
const technical_controller = require("../controller/tbtechnical.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const technical = (app) =>{
 
    app.get("/api/technical/getList",technical_controller.getList);
    app.post("/api/technical/getone",technical_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/technical/create",upload.single("image"),technical_controller.create);
    app.put("/api/technical/update",upload.single("image"),technical_controller.update);
    app.delete("/api/technical/delete",technical_controller.remove);    
}
module.exports = technical;


