
const tbmarquee_controller = require("../controller/tbmarquee.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const tbmarquee = (app) =>{
 
    app.get("/api/tbmarquee/getList",tbmarquee_controller.getList);
    app.post("/api/tbmarquee/getone",tbmarquee_controller.getOne);
   
    app.post("/api/tbmarquee/create",CheckToken(),upload.single("image"),tbmarquee_controller.create);
    app.put("/api/tbmarquee/update",CheckToken(),upload.single("image"),tbmarquee_controller.update);
    app.delete("/api/tbmarquee/delete",CheckToken(),tbmarquee_controller.remove);    
}
module.exports = tbmarquee;


