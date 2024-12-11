
const training_controller = require("../controller/training.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const training = (app) =>{
 
    app.get("/api/training/getList",training_controller.getList);
    app.post("/api/training/getone",training_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/training/create",upload.single("image"),training_controller.create);
    app.put("/api/training/update",upload.single("image"),training_controller.update);
    app.delete("/api/training/delete",training_controller.remove);    
}
module.exports = training;


