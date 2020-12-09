let express = require("express");// use express to serve up the UI page
// let http = require("http").createServer(app)
const socketIO = require('socket.io');


const PORT = process.env.PORT || 5001;
const INDEX = '/public/';


const server = express()
    // .use((req, res) => res.sendFile(INDEX, {root: __dirname}))
    .use(express.static(__dirname + "/public"))
    // .get('/', (req, res) => res.render('/index'))
    .listen(PORT, () => console.log(`Listening on port : ${PORT}`));

const io = socketIO(server);

