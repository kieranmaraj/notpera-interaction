const socket = io();
let typeInfo = {
    type: "audience",
    isConnected: false
};

let w = 300;
let h = 300;
let canvas;
let ctx;

let display = document.getElementById('classification_return')

let mouse = {
    x: 0,
    y: 0,
    isDown: false
}

let lastPoint = {x: 0, y: 0};

setUpCanvas();

window.requestAnimationFrame(draw);

document.body.addEventListener("touchstart", function (e) {
    // if (e.target == canvas) {
      e.preventDefault();
    // }
  }, false);
  document.body.addEventListener("touchend", function (e) {
    // if (e.target == canvas) {
      e.preventDefault();
    // }
  }, false);
  document.body.addEventListener("touchmove", function (e) {
    // if (e.target == canvas) {
      e.preventDefault();
    // }
  }, false);

canvas.addEventListener('pointerdown', (event)=>{
    const pos = getPointerPosition(canvas, event);

    // event.preventDefault();
    // event.stopPropagation();
    
    mouse.isDown = true;
    lastPoint.x = pos.x;
    lastPoint.y = pos.y;
    mouse.x = pos.x;
    mouse.y = pos.y;
});

canvas.addEventListener('pointermove', (event)=>{
    // event.preventDefault();

    const pos = getPointerPosition(canvas, event);

    if(mouse.isDown){
        lastPoint.x = mouse.x;
        lastPoint.y = mouse.y;
        mouse.x = pos.x;
        mouse.y = pos.y;
    }
});

canvas.addEventListener('pointerup', (event)=>{
    // event.preventDefault();

    if(mouse.isDown){
        mouse.isDown = false;
    }
});

document.getElementById('submit').onclick = () =>{
 
    if(typeInfo.isConnected){

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let pixels = [];

        for(var i =0; i < data.length; i+=4){
            let val = data[i+3];

            if(val==0){
                val = 255;
            }else if(val > 0){
                val = 0;
            }
            pixels.push(val);                               
        }
        // console.log(pixels);
        socket.emit("canvasData", pixels);
    }
    ctx.clearRect(0, 0, w, h);
}

socket.on("connect", ()=>{
    console.log("received server connection");
    typeInfo.isConnected = true;
    socket.emit("assignType", typeInfo.type);
})

socket.on("disconnect", ()=>{
    console.log("server disconnected");
    typeInfo.isConnected = false;
})

socket.on("returnIndividual", (classify)=>{
    console.log(`You voted for: ${classify}`);
    const dispString = `You voted for: ${classify}`;
    display.innerHTML = dispString;
})

socket.on("returnCollective", (classify=>{
    console.log(`The audience has selected: ${classify}`);
    const dispString = `The audience has selected: ${classify}`;
    display.innerHTML = dispString;
}))

function draw(){
    if(mouse.isDown){
        ctx.beginPath();
        ctx.fillstyle = "black";
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(mouse.x, mouse.y);
        // ctx.arc(mouse.x, mouse.y, 10, 0, 2*Math.PI);
        // ctx.fill();
        ctx.stroke();
        ctx.closePath();
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
