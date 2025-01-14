const book_controller = require("../controller/book.controller");
const { CheckToken } = require("../controller/user.controller");
const { upload_file } = require("../config/helper");

const book = (app) => {
    // app.use(CheckToken());

    app.get("/api/book/getList", book_controller.getList);
    app.get("/api/book/:id", book_controller.getOne); // Use GET for fetching one book by ID
    
    app.post("/api/book/create",CheckToken(), upload_file.single('file'), book_controller.create);
    app.put("/api/book/update/",CheckToken(), upload_file.single('File'), book_controller.update);
    app.delete("/api/book/delete",CheckToken(), book_controller.remove);


}

module.exports = book;
