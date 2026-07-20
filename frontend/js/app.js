const clockElement=document.querySelector(".clock");
const greetingElement=document.querySelector(".topbar h2");
const searchInput=document.querySelector(".search-box input");
const appGrid=document.getElementById("appGrid");
let apps=[];

function updateClock(){
const now=new Date();
clockElement.textContent=now.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});
}

function updateGreeting(){
const hour=new Date().getHours();
let greeting="Good Evening";
if(hour<12){
greeting="Good Morning";
}else if(hour<18){
greeting="Good Afternoon";
}
greetingElement.textContent=`${greeting} 👋`;
}

async function loadApps(){
try{
const response=await fetch("/api/apps");
apps=await response.json();
renderApps(apps);
}catch(error){
console.error("Failed to load apps:",error);
}
}

function renderApps(list){
appGrid.innerHTML="";
list.forEach(app=>{
const card=document.createElement("div");
card.className="app-card";
card.innerHTML=`
<div class="icon">${app.icon}</div>
<h4>${app.name}</h4>
`;
card.onclick=()=>{
window.open(app.url,"_blank");
};
appGrid.appendChild(card);
});
}

function setupSearch(){
searchInput.addEventListener("input",()=>{
const search=searchInput.value.toLowerCase();
const filtered=apps.filter(app=>
app.name.toLowerCase().includes(search)
);
renderApps(filtered);
});
}

function setupNavigation(){
const buttons=document.querySelectorAll(".nav-item");
const pages=document.querySelectorAll(".page");
buttons.forEach(button=>{
button.addEventListener("click",()=>{
const target=button.dataset.page;
buttons.forEach(btn=>{
btn.classList.remove("active");
});
button.classList.add("active");
pages.forEach(page=>{
page.classList.remove("active");
});
document.getElementById(target).classList.add("active");
});
});
}

function initializeAexus(){
updateClock();
updateGreeting();
loadApps();
setupSearch();
setupNavigation();
}

setInterval(updateClock,1000);
setInterval(updateGreeting,60000);
initializeAexus();