const socket = io();
let typeInfo = {
    type: "audience",
    isConnected: false
};

let w = 300;
let h = 300;
let canvas;
let ctx;
let canvasCoordinates = [];

let mouse = {
    x: 0,
    y: 0,
    isDown: false
}

setUpCanvas();

window.requestAnimationFrame(draw);

canvas.addEventListener('pointerdown', (event)=>{
    const pos = getPointerPosition(canvas, event);
    
    mouse.isDown = true;
    mouse.x = pos.x;
    mouse.y = pos.y;
});

canvas.addEventListener('pointermove', (event)=>{
    const pos = getPointerPosition(canvas, event);

    if(mouse.isDown){
        mouse.x = pos.x;
        mouse.y = pos.y;
    }
});

canvas.addEventListener('pointerup', (event)=>{
    if(mouse.isDown){
        mouse.isDown = false;
    }
});

document.getElementById('submit').onclick = () =>{
    // ctx.fillStyle = "white";
    ctx.clearRect(0, 0, w, h);
}

socket.on("connect", ()=>{
    console.log("received server connection");
    typeInfo.isConnected = true;
    socket.emit("assignType", typeInfo.type);
})

function draw(){
    if(mouse.isDown){
        ctx.beginPath();
        // ctx.m /oveTo(mouse.x, mouse.y);
        ctx.arc(mouse.x, mouse.y, 10, 0, 2*Math.PI);
        ctx.fill();
    }

    window.requestAnimationFrame(draw);
}

function getPointerPosition(canvas, event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {x: x, y: y};
}

function setUpCanvas(){
    canvas = document.querySelector("#canvas");
    ctx=canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;
    canvas.style.border = "1px solid #000000";
}
