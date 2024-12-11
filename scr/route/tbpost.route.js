
const tbpost_controller = require("../controller/tbpost.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const tbpost = (app) =>{

    app.get("/api/tbpost/getList",tbpost_controller.getList);
    //app.use(CheckToken());
    app.post("/api/tbpost/create",upload.single("image"),tbpost_controller.create);
    app.put("/api/tbpost/update",upload.single("image"),tbpost_controller.update);
    app.delete("/api/tbpost/delete",tbpost_controller.remove);    
}
module.exports = tbpost;


