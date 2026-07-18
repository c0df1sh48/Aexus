const clockElement=document.querySelector(".clock");
const greetingElement=document.querySelector(".topbar h2");
const searchInput=document.querySelector(".search-box input");

const appGrid=document.getElementById("appGrid");
let apps=[];

function updateClock(){
    const now=new Date();
    const time=now.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });
    clockElement.textContent=time;
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
function setupSearch(){
    searchInput.addEventListener("input",()=>{
        const search=searchInput.value.toLowerCase();

        const filtered=apps.filter(app =>
            app.name.toLowerCase().includes(search)
        );

        renderApps(filtered);
    });
}
function setupApps(){
    appCards.forEach(card=>{
        card.addEventListener("click",()=>{
            console.log(
                `Opening ${card.querySelector("h4").textContent}`
            );
        });
    });
}
async function loadApps(){
    const response=await fetch("../../data/apps.json");
    apps=await response.json();
    renderApps(apps);
}
function renderApps(list){
    appGrid.innerHTML="";
    list.forEach(app=>{
        const card=document.createElement("div");
        card.className="app-card";
        card.innerHTML=`
            <div class="icon">
                ${app.icon}
            </div>
            <h4>
                ${app.name}
            </h4>
        `;
        card.onclick=()=>{
            window.open(app.url,"_blank");
        };
        appGrid.appendChild(card);
    });
}

function initializeAexus(){
    updateClock();
    updateGreeting();
    setupSearch();
    loadApps();
}
setInterval(updateClock,1000);
setInterval(updateGreeting,60000);
initializeAexus();