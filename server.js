var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('IT Samul!\n');
}).listen(3306, 'www.tsnh.online');

console.log('Server running at https://www.tnsh.online:3306/');