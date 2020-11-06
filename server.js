// const path = require('path');
// const express = require('express');
// const app = express();
//
// //hide from public git
// app.get('/env', (req, res) => res.send({
//   devpass:process.env.DEV_PASS,
//   socketurl:process.env.SOCKET_URL,
//   devsocketurl:process.env.DEV_SOCKET_URL
// }));
//
// app.use(express.static(__dirname + '/dist/angulartemp'));
//
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/dist/angulartemp/index.html'));
// });
//
// app.listen(process.env.PORT || 5000);
