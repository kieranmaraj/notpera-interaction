let express = require("express");// use express to serve up the UI page
// let http = require("http").createServer(app)
const socketIO = require('socket.io');
let toBuffer = require('blob-to-buffer');


const PORT = process.env.PORT || 5001;
const INDEX = '/public/';

let audienceSize = 0;


const server = express()
    // .use((req, res) => res.sendFile(INDEX, {root: __dirname}))
    .use(express.static(__dirname + "/public"))
    // .get('/', (req, res) => res.render('/index'))
    .listen(PORT, () => console.log(`Listening on port : ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket)=>{
    console.log("received connection from client: ");

    socket.on("assignType", (type)=>{
        socket.type = type;

        console.log(`type is ${type}.`);

        if(type == "audience"){
            audienceSize++;
            console.log(`Audience size is ${audienceSize}.`);
        }
    })

    socket.on("canvasData", (arraybuffer)=>{
        // let buffer = Buffer.from(arraybuffer);
        console.log(arraybuffer);
        console.log(typeof(arraubuffer));
        // console.log(blob);
        // let imgBlob = new Blob(blob, {type: 'image/png'});

        // toBuffer(imgBlob, (err, buffer)=>{
        //     if(err) throw err

        //     console.log(buffer);
        // })
    })

    socket.on("disconnect", ()=>{
        if(socket.type == "audience"){
            audienceSize--;
            console.log(`Audience member left. Audience size is: ${audienceSize}.`);
        }
    })
})

