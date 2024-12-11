const posts_controller = require('../controller/posts.controller');
const { upload_multi } = require('../config/helper');

const posts = (app) => {
  app.get('/api/posts/getlist', posts_controller.getList);
  app.get('/api/posts/:id', posts_controller.getOne);
  app.post('/api/posts/create', upload_multi.array('photos'), posts_controller.create);
  app.put('/api/posts/update/:id', upload_multi.array('photos'), posts_controller.update);
  app.delete('/api/posts/delete', posts_controller.remove);
};

module.exports = posts;
