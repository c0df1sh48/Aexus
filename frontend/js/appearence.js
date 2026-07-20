const background=document.querySelector(".background");

let currentTheme=localStorage.getItem("theme")||"dark";
let currentWallpaper=localStorage.getItem("wallpaper")||"aurora";

function applyAppearance(){

background.className="background";

background.classList.add(currentTheme);

background.classList.add(currentWallpaper);

localStorage.setItem("theme",currentTheme);
localStorage.setItem("wallpaper",currentWallpaper);

}

function setupThemes(){

const darkButton=document.getElementById("darkMode");
const lightButton=document.getElementById("lightMode");

if(darkButton){
darkButton.onclick=()=>{
currentTheme="dark";
applyAppearance();
};
}

if(lightButton){
lightButton.onclick=()=>{
currentTheme="light";
applyAppearance();
};
}

}

function setupWallpapers(){

document.querySelectorAll(".wallpaper").forEach(button=>{

button.onclick=()=>{

currentWallpaper=button.dataset.wallpaper;

applyAppearance();

};

});

}

setupThemes();
setupWallpapers();
applyAppearance();