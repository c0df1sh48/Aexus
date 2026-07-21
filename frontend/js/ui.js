function showPage(pageID){

document
.querySelectorAll(".page")
.forEach(page=>{

page.classList.remove("active");

});


document
.getElementById(pageID)
.classList.add("active");



document
.querySelectorAll(".nav-item")
.forEach(btn=>{

btn.classList.remove("active");

});

}