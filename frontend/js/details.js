let selectedApp = null;


function openAppDetails(index){

selectedApp=index;

const app=managerApps[index];


document.getElementById("detailTitle").textContent=
app.name;



const iconBox=
document.getElementById("detailIconDisplay");


if(app.iconType==="image"){

iconBox.innerHTML=
`
<img src="${app.icon}" class="detail-image-icon">
`;

}else{

iconBox.textContent=
app.icon || "📦";

}



document.getElementById("detailURL").textContent=
app.url;


document.getElementById("detailFavorite").textContent=
app.favorite ? "⭐ Yes" : "No";


document.getElementById("detailEnabled").textContent=
app.enabled ? "✅ Enabled" : "Disabled";



document
.getElementById("editAppForm")
.classList.add("hidden");


showPage("appDetailsPage");

}





// Open edit mode

document
.getElementById("editApp")
?.addEventListener(
"click",
()=>{


const app=
managerApps[selectedApp];


document
.getElementById("editAppForm")
.classList.remove("hidden");



document.getElementById("detailName").value=
app.name;


document.getElementById("detailEditURL").value=
app.url;


document.getElementById("detailIcon").value=
app.icon;



document.getElementById("detailFavoriteEdit").checked=
app.favorite;


document.getElementById("detailEnabledEdit").checked=
app.enabled;


});






// Save changes

document
.getElementById("saveApp")
?.addEventListener(
"click",
async ()=>{


let app=
managerApps[selectedApp];


app.name=
document.getElementById("detailName").value;


app.url=
document.getElementById("detailEditURL").value;


app.icon=
document.getElementById("detailIcon").value;


app.iconType="emoji";


app.favorite=
document.getElementById("detailFavoriteEdit").checked;


app.enabled=
document.getElementById("detailEnabledEdit").checked;



await fetch(
`/api/apps/${selectedApp}`,
{
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(app)

});



await loadApps();


openAppDetails(selectedApp);


});






// Cancel editing

document
.getElementById("cancelEdit")
?.addEventListener(
"click",
()=>{


document
.getElementById("editAppForm")
.classList.add("hidden");


});







// Open delete popup

document
.getElementById("deleteDetailApp")
?.addEventListener(
"click",
()=>{


document
.getElementById("deleteOverlay")
.classList.remove("hidden");


document
.getElementById("deleteConfirmInput")
.value="";


});








// Cancel delete

document
.getElementById("cancelDelete")
?.addEventListener(
"click",
()=>{


document
.getElementById("deleteOverlay")
.classList.add("hidden");


});







// Confirm delete

document
.getElementById("confirmDelete")
?.addEventListener(
"click",
async ()=>{


const typedName =
document
.getElementById("deleteConfirmInput")
.value
.trim();



const app =
managerApps[selectedApp];



if(typedName !== app.name){

alert("App name does not match.");

return;

}



await fetch(
`/api/apps/${selectedApp}`,
{
method:"DELETE"
}
);



document
.getElementById("deleteOverlay")
.classList.add("hidden");



await loadApps();



showPage("appsPage");


});