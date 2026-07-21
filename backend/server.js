const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

const PORT = 1000;

app.use(cors());
app.use(express.json());


// Upload setup

const uploadFolder = path.join(
__dirname,
"uploads"
);


if(!fs.existsSync(uploadFolder)){
fs.mkdirSync(uploadFolder);
}


const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,uploadFolder);
},

filename:(req,file,cb)=>{

const ext = path.extname(file.originalname);

const name =
Date.now() + ext;

cb(null,name);

}

});


const upload = multer({
storage:storage
});



// Serve uploaded icons

app.use(
"/uploads",
express.static(uploadFolder)
);



// Serve frontend

app.use(express.static(
path.join(__dirname,"../frontend")
));



// Apps file

const appsFile = path.join(
__dirname,
"data",
"Apps.json"
);



function getApps(){

return JSON.parse(
fs.readFileSync(appsFile,"utf8")
);

}



function saveApps(apps){

fs.writeFileSync(
appsFile,
JSON.stringify(apps,null,4)
);

}




// API


// Get apps

app.get("/api/apps",(req,res)=>{

res.json(
getApps()
);

});




// Add app

app.post("/api/apps",(req,res)=>{

let apps=getApps();


apps.push(req.body);


saveApps(apps);


res.json({
success:true
});

});




// Delete app

app.delete("/api/apps/:id",(req,res)=>{

let apps=getApps();


apps.splice(
req.params.id,
1
);


saveApps(apps);


res.json({
success:true
});

});




// Edit app

app.put("/api/apps/:id",(req,res)=>{

let apps=getApps();


apps[req.params.id]=req.body;


saveApps(apps);


res.json({
success:true
});

});




// Upload icon

app.post(
"/api/upload-icon",
upload.single("icon"),
(req,res)=>{


if(!req.file){

return res.status(400).json({

error:"No image uploaded"

});

}



res.json({

success:true,

path:
"/uploads/"+req.file.filename

});


});




// Start

app.listen(PORT,()=>{

console.log(
`Aexus running on http://localhost:${PORT}`
);

});