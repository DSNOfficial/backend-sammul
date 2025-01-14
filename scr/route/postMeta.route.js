const postMeta_controller = require("../controller/postMeta.controller")
const { CheckToken } = require("../controller/user.controller");
const postMeta = (app) =>{ 
    app.get("/api/postMeta/getList",postMeta_controller.getList);
    
    app.post("/api/postMeta/create",CheckToken(),postMeta_controller.create);
    app.put("/api/postMeta/update",CheckToken(),postMeta_controller.update);
    app.delete("/api/postMeta/delete",CheckToken(),postMeta_controller.remove); 
}
module.exports = postMeta;
