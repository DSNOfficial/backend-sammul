
const training_controller = require("../controller/training.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const training = (app) =>{
 
    app.get("/api/training/getList",training_controller.getList);
    app.post("/api/training/getone",training_controller.getOne);
  
    app.post("/api/training/create",CheckToken(),upload.single("image"),training_controller.create);
    app.put("/api/training/update",CheckToken(),upload.single("image"),training_controller.update);
    app.delete("/api/training/delete",CheckToken(),training_controller.remove);    
}
module.exports = training;


