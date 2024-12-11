
const user_controller = require("../controller/user.controller");
// const { CheckToken } = require("../controller/user.controller");

const user = (app) => {
    // Public routes
    
    app.get("/api/user/getList", user_controller.getList);
    app.post("/api/user/login", user_controller.login);
    app.post("/api/refresh_token", user_controller.refresh_token);
    //  app.use(CheckToken());
    app.post("/api/user/create", user_controller.create);
    app.put("/api/user/update", user_controller.update);
    app.post("/api/user/setPassword", user_controller.setPassword);
    app.delete("/api/user/delete", user_controller.remove);
      // Protected routes
    // app.use(CheckToken()); // Apply middleware to all routes defined after this line
};

module.exports = user;





