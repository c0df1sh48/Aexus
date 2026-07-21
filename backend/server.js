const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const si = require("systeminformation");

const app = express();

const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());


// =====================
// ICON UPLOAD
// =====================

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



// =====================
// APP DATA
// =====================

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



// =====================
// APP API
// =====================


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




// =====================
// ICON UPLOAD API
// =====================


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




// =====================
// SYSTEM INFO API
// =====================


app.get("/api/system", async (req,res)=>{

try{


const cpu =
await si.currentLoad();


const memory =
await si.mem();


const storage =
await si.fsSize();


const os =
await si.osInfo();


const time =
await si.time();


const temp =
await si.cpuTemperature();


const network =
await si.networkStats();


const load =
await si.currentLoad();


const networkInterfaces =
await si.networkInterfaces();



// Find local IP

const ip =
networkInterfaces.find(
i => i.ip4 && !i.internal
)?.ip4 || "Unknown";



res.json({



cpu:
Math.round(
cpu.currentLoad
),



memory:{

used:
Math.round(
memory.used /
1024 /
1024 /
1024
),

total:
Math.round(
memory.total /
1024 /
1024 /
1024
)

},



storage:{

used:
Math.round(
storage[0].used /
1024 /
1024 /
1024
),

total:
Math.round(
storage[0].size /
1024 /
1024 /
1024
)

},



hostname:
os.hostname,



platform:
os.platform,



kernel:
os.kernel,


release:
os.release,



uptime:
Math.floor(
time.uptime /
3600
),



// Extra information


ip:
ip,



temperature:
temp.main || 0,



network:{

download:
network[0]?.rx_sec || 0,

upload:
network[0]?.tx_sec || 0

},



load:
Number(
load.currentLoad.toFixed(1)
)



});


}catch(error){


console.error(
"System info error:",
error
);


res.status(500).json({

error:
"Failed to get system info"

});


}


});




// =====================
// START SERVER
// =====================


app.listen(PORT,()=>{

console.log(
`Aexus running on http://localhost:${PORT}`
);

});