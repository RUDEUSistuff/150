let mode="",xp=0,level=1;
let scene,camera,renderer,mesh;

/* START */
function startApp(){
document.getElementById("start").style.display="none";
document.getElementById("app").style.display="block";
}

/* MODE */
function setMode(m){
mode=m;
document.getElementById("controls").innerHTML="";
document.getElementById("canvas").innerHTML="";

if(m==="3d"){
document.getElementById("controls").innerHTML=`
<input id="size" placeholder="Size">
<button onclick="create3D('cube')">Cube</button>
<button onclick="create3D('sphere')">Sphere</button>
<button onclick="create3D('cylinder')">Cylinder</button>
`;
}

if(m==="graph"){
document.getElementById("controls").innerHTML=`
<input id="func" placeholder="y = x*x">
<button onclick="drawGraph()">Draw</button>
<canvas id="chart"></canvas>
`;
}

if(m==="atoms") atomsSim();
if(m==="puzzle") generatePuzzle();
}

/* XP */
function addXP(val){
if(val<=0) return;
xp+=val;
if(xp>=100){level++;xp=0;}
document.getElementById("xp").innerText=`XP: ${xp} | Level: ${level}`;
}

/* AI CALC */
function calculate(){
let input=document.getElementById("input").value;
if(!input) return;

try{
input=input.replace(/sin/g,"Math.sin")
.replace(/cos/g,"Math.cos")
.replace(/tan/g,"Math.tan")
.replace(/log/g,"Math.log10")
.replace(/ln/g,"Math.log")
.replace(/×/g,"*").replace(/÷/g,"/");

let result=eval(input);
document.getElementById("result").innerText=result;
addXP(10);
}catch{
document.getElementById("result").innerText="Error";
}
}

/* 3D */
function create3D(type){
let size=parseFloat(document.getElementById("size").value)||1;

scene=new THREE.Scene();
camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
renderer=new THREE.WebGLRenderer();
renderer.setSize(300,300);

document.getElementById("canvas").appendChild(renderer.domElement);

let geo;
if(type==="cube") geo=new THREE.BoxGeometry(size,size,size);
if(type==="sphere") geo=new THREE.SphereGeometry(size,32,32);
if(type==="cylinder") geo=new THREE.CylinderGeometry(size,size,2,32);

let mat=new THREE.MeshNormalMaterial();
mesh=new THREE.Mesh(geo,mat);
scene.add(mesh);

camera.position.z=5;

let volume = size**3;
document.getElementById("result").innerText="Volume: "+volume;

function animate(){
requestAnimationFrame(animate);
mesh.rotation.x+=0.01;
mesh.rotation.y+=0.01;
renderer.render(scene,camera);
}
animate();
}

/* GRAPH */
function drawGraph(){
let func=document.getElementById("func").value;

let x=[],y=[];
for(let i=-10;i<=10;i++){
x.push(i);
y.push(eval(func.replace(/x/g,i)));
}

new Chart(document.getElementById("chart"),{
type:"line",
data:{labels:x,datasets:[{data:y}]}
});
}

/* ATOMS */
function atomsSim(){
let canvas=document.createElement("canvas");
canvas.width=300;
canvas.height=200;
document.getElementById("canvas").appendChild(canvas);
let ctx=canvas.getContext("2d");

let atoms=[];
for(let i=0;i<80;i++){
atoms.push({x:Math.random()*300,y:Math.random()*200,vx:1,vy:1});
}

let heat=1;

canvas.onmousemove=()=>heat=5;

function loop(){
ctx.clearRect(0,0,300,200);

atoms.forEach(a=>{
a.x+=a.vx*heat;
a.y+=a.vy*heat;

if(a.x<0||a.x>300)a.vx*=-1;
if(a.y<0||a.y>200)a.vy*=-1;

ctx.fillRect(a.x,a.y,2,2);
});

heat*=0.95;
requestAnimationFrame(loop);
}
loop();
}

/* PUZZLE */
function generatePuzzle(){
let a=Math.floor(Math.random()*20);
let b=Math.floor(Math.random()*20);
let ans=a+b;

let options=[ans,ans+1,ans-1,ans+2].sort(()=>Math.random()-0.5);

let html=`<h3>${a}+${b}=?</h3>`;
options.forEach(o=>{
html+=`<button onclick="checkAns(${o},${ans})">${o}</button>`;
});

document.getElementById("controls").innerHTML=html;
}

function checkAns(o,ans){
if(o===ans){
document.getElementById("result").innerText="Correct!";
addXP(20);
}else{
document.getElementById("result").innerText="Wrong!";
}
}

/* SAKURA */
let sakura=document.getElementById("sakura");
let ctx=sakura.getContext("2d");
sakura.width=window.innerWidth;
sakura.height=window.innerHeight;

let petals=[];
for(let i=0;i<50;i++){
petals.push({x:Math.random()*sakura.width,y:Math.random()*sakura.height});
}

function draw(){
ctx.clearRect(0,0,sakura.width,sakura.height);
petals.forEach(p=>{
p.y+=1;
if(p.y>sakura.height)p.y=0;
ctx.fillStyle="pink";
ctx.fillRect(p.x,p.y,3,3);
});
requestAnimationFrame(draw);
}
draw();
