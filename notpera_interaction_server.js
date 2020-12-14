let express = require("express");// use express to serve up the UI page
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5001;
let audienceSize = 0;


const server = express()
    .use(express.static(__dirname + "/public"))
    .listen(PORT, () => console.log(`Listening on port : ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket)=>{
    console.log("hello!");
    console.log("received connection from client: ");

    socket.on("assignType", (type)=>{
        socket.type = type;

        console.log(`type is ${type}.`);

        if(type == "audience"){
            audienceSize++;
            console.log(`Audience size is ${audienceSize}.`);
        }
    })

    socket.on("canvasData", (array)=>{
        // let buffer = Buffer.from(arraybuffer);
        // console.log(array);
        io.sockets.clients((error, clients)=>{
            if(error) throw error;
            for(let i =0; i < clients.length; i++){
                if(io.sockets.connected[clients[i]].type === "image-receiver"){
                    io.sockets.connected[clients[i]].emit("canvasData", array);
                }
            }
        })   
    })

    socket.on("count_votes", (n)=>{
        io.sockets.clients((error, clients)=>{
            if(error) throw error;
            for(let i =0; i < clients.length; i++){
                if(io.sockets.connected[clients[i]].type === "image-receiver"){
                    io.sockets.connected[clients[i]].emit("count_votes", n);
                }
            }
        })  
    })

    socket.on("disconnect", ()=>{
        if(socket.type == "audience"){
            audienceSize--;
            console.log(`Audience member left. Audience size is: ${audienceSize}.`);
        }
    })
})

