let managerApps=[];


async function loadApps(){

const response = await fetch("/api/apps");

managerApps = await response.json();

renderManager();

}




function renderManager(){

const box=document.getElementById("managerApps");

if(!box)return;


box.innerHTML="";


managerApps.forEach((app,index)=>{


let icon;


if(app.iconType==="image"){

icon=
`<img src="${app.icon}" class="icon">`;

}else{

icon=
`<div class="icon">${app.icon}</div>`;

}


box.innerHTML+=`

<div class="app-card"
onclick="openAppDetails(${index})">


<div class="app-card-header">


<div class="app-icon">

${app.iconType==="image"
?
`<img src="${app.icon}">`
:
app.icon || "📦"
}

</div>


<h4>
${app.name}
</h4>


</div>


<p>
${app.url}
</p>`


});


}





async function uploadIcon(){

const fileInput=
document.getElementById("appImage");


if(!fileInput.files.length){

return null;

}



const formData=new FormData();


formData.append(
"icon",
fileInput.files[0]
);



const response =
await fetch(
"/api/upload-icon",
{
method:"POST",
body:formData
}
);



const data=
await response.json();


return data.path;

}




async function addApplication(){


let icon =
document.getElementById("appIcon").value
||
"📦";


let iconType="emoji";



const uploadedIcon =
await uploadIcon();



if(uploadedIcon){

icon=uploadedIcon;

iconType="image";

}



let app={

name:
document.getElementById("appName").value,


url:
document.getElementById("appURL").value,


icon:icon,


iconType:iconType,


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

body:
JSON.stringify(app)

}

);



document.getElementById("appName").value="";
document.getElementById("appURL").value="";
document.getElementById("appIcon").value="";
document.getElementById("appImage").value="";


document
.getElementById("addAppOverlay")
.classList.add("hidden");



loadApps();


}






document
.getElementById("addApp")
?.addEventListener(
"click",
addApplication
);





const addPanel =
document.getElementById(
"addAppOverlay"
);



document
.getElementById("openAddApp")
?.addEventListener(
"click",
()=>{

addPanel.classList.remove(
"hidden"
);

}
);



document
.getElementById("closeAddApp")
?.addEventListener(
"click",
()=>{

addPanel.classList.add(
"hidden"
);

}
);




loadApps();