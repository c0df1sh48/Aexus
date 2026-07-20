let managerApps=[];


async function loadApps(){

const response =
await fetch("/api/apps");

managerApps=await response.json();

renderManager();

}



function renderManager(){

const box=
document.getElementById("managerApps");


if(!box)return;


box.innerHTML="";


managerApps.forEach((app,index)=>{


box.innerHTML+=`

<div class="widget">

<h3>
${app.icon}
${app.name}
</h3>


<p>
${app.url}
</p>


<button onclick="deleteApp(${index})">
🗑 Delete
</button>


</div>

`;

});

}




async function addApplication(){

let app={

name:
document.getElementById("appName").value,

url:
document.getElementById("appURL").value,

icon:
document.getElementById("appIcon").value || "📦",

favorite:false,

enabled:true

};


await fetch(
"/api/apps",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(app)

});


loadApps();

}




async function deleteApp(index){

await fetch(
`/api/apps/${index}`,
{
method:"DELETE"
}
);


loadApps();

}



document
.getElementById("addApp")
?.addEventListener(
"click",
addApplication
);



loadApps();

const addPanel =
document.getElementById("addAppOverlay");


document
.getElementById("openAddApp")
?.addEventListener("click",()=>{

addPanel.classList.remove("hidden");

document
.querySelector(".aexus-container")

});
document
.getElementById("closeAddApp")
?.addEventListener("click",()=>{

addPanel.classList.add("hidden");

document
.querySelector(".aexus-container")

});