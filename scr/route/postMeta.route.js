const postMeta_controller = require("../controller/postMeta.controller")
const postMeta = (app) =>{ 
    app.get("/api/postMeta/getList",postMeta_controller.getList);
    app.post("/api/postMeta/create",postMeta_controller.create);
    app.put("/api/postMeta/update",postMeta_controller.update);
    app.delete("/api/postMeta/delete",postMeta_controller.remove); 
}
module.exports = postMeta;
