const postnew_controller = require('../controller/postnew.controller');
const { upload } = require('../config/helper');

const postnew = (app) => {
    app.get('/api/postnew/getlist', postnew_controller.getList);
    // app.get('/api/postnew/getOne', postnew_controller.getOne);
    app.post('/api/postnew/create', upload.array('images', 10), postnew_controller.create);
    app.put('/api/postnew/update', upload.array('images', 10), postnew_controller.update);
    app.delete('/api/postnew/delete', postnew_controller.remove);
};

module.exports = postnew;
