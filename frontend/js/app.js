const clockElement=document.querySelector(".clock");
const greetingElement=document.querySelector(".topbar h2");
const searchInput=document.querySelector(".search-box input");
const appGrid=document.getElementById("appGrid");
const favoriteGrid=document.getElementById("favoriteGrid");

let apps=[];


function updateClock(){

const now=new Date();

clockElement.textContent=
now.toLocaleTimeString([],{
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


greetingElement.textContent=
`${greeting} 👋`;

}




window.loadApps = async function(){

try{

const response =
await fetch("/api/apps");


apps =
await response.json();



renderApps(apps);

renderFavorites();



if(window.managerApps){

window.managerApps =
apps;

}



if(typeof renderManager === "function"){

renderManager();

}



}catch(error){

console.error(
"Failed to load apps:",
error
);

}

};





function createAppIcon(app){

if(app.iconType==="image" && app.icon){

return `
<img 
src="${app.icon}" 
class="app-image-icon"
onerror="this.src='📦'"
>
`;

}


return `
<div class="emoji-icon">
${app.icon || "📦"}
</div>
`;

}





function renderApps(list){


if(!appGrid)return;


appGrid.innerHTML="";



list.forEach(app=>{


const card =
document.createElement("div");


card.className="app-card";



card.innerHTML=`

<div class="app-card-header">


<div class="app-icon">

${createAppIcon(app)}

</div>


<h4>

${app.name}

${app.favorite ? "⭐" : ""}

</h4>


</div>

`;



card.onclick=()=>{

window.open(
app.url,
"_blank"
);

};



appGrid.appendChild(card);


});


}







function renderFavorites(){


if(!favoriteGrid)return;


favoriteGrid.innerHTML="";


const favorites =
apps.filter(app=>app.favorite);



favorites.forEach(app=>{


const card =
document.createElement("div");


card.className="app-card";



card.innerHTML=`

<div class="app-card-header">


<div class="app-icon">

${createAppIcon(app)}

</div>


<h4>

${app.name}

⭐

</h4>


</div>

`;



card.onclick=()=>{

window.open(
app.url,
"_blank"
);

};



favoriteGrid.appendChild(card);



});


}








function setupSearch(){


if(!searchInput)return;


searchInput.addEventListener(
"input",
()=>{


const search =
searchInput.value.toLowerCase();



const filtered =
apps.filter(app=>

app.name
.toLowerCase()
.includes(search)

);



renderApps(filtered);



});

}





function setupNavigation(){


const buttons =
document.querySelectorAll(".nav-item");


const pages =
document.querySelectorAll(".page");



buttons.forEach(button=>{


button.addEventListener(
"click",
()=>{


const target =
button.dataset.page;



buttons.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



pages.forEach(page=>{

page.classList.remove("active");

});



document
.getElementById(target)
.classList.add("active");


if(target === "favoritesPage"){

loadApps();

}
});

});


}







function initializeAexus(){

updateClock();

updateGreeting();

window.loadApps();

setupSearch();

setupNavigation();

}



setInterval(
updateClock,
1000
);


setInterval(
updateGreeting,
60000
);



initializeAexus();