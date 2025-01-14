
const account_controller = require("../controller/tbaccount.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const account = (app) =>{
 
    app.get("/api/account/getList",account_controller.getList);
    app.post("/api/account/getone",account_controller.getOne);
   
    app.post("/api/account/create",CheckToken(),upload.single("image"),account_controller.create);
    app.put("/api/account/update",CheckToken(),upload.single("image"),account_controller.update);
    app.delete("/api/account/delete",CheckToken(),account_controller.remove);    
}
module.exports = account;


