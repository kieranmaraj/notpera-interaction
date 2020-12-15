let express = require("express");// use express to serve up the UI page
const socketIO = require('socket.io');
const metal = require("metal-name");

const PORT = process.env.PORT || 5001;
let audienceSize = 0;

let names = [];


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


            let metalName = metal();
            while(names.indexOf(metalName) >= 0){
                metalName = metal();
            }
            names.push(metalName);
            socket.name = metalName;

            // socket.emit("assign_name", metalName);

        }
    })

    socket.on("canvasData", (array)=>{
        // let buffer = Buffer.from(arraybuffer);
        // console.log(array);
        io.sockets.clients((error, clients)=>{
            if(error) throw error;
            for(let i =0; i < clients.length; i++){
                if(io.sockets.connected[clients[i]].type === "image-receiver"){
                    io.sockets.connected[clients[i]].emit("canvasData", array, socket.name);
                }
            }
        })   
    })

    socket.on("returnIndividual", (name, classify)=>{
        io.sockets.clients((error, clients)=>{
            if(error) throw error;
            for(let i = 0; i < clients.length; i++){
                if(io.sockets.connected[clients[i]].name == name){
                    io.sockets.connected[clients[i]].emit("returnIndividual", classify);
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
            let ndx = names.indexOf(socket.name);
            names.splice(ndx, 1);

            audienceSize--;
            console.log(`Audience member left. Audience size is: ${audienceSize}.`);
        }
    })
})

