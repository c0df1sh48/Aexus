const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");


const app = express();

const PORT = 1000;


app.use(cors());
app.use(express.json());


// Serve frontend
app.use(express.static(
path.join(__dirname,"../frontend")
));



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

app.get("/api/apps",(req,res)=>{

res.json(getApps());

});



app.post("/api/apps",(req,res)=>{

let apps=getApps();

apps.push(req.body);

saveApps(apps);

res.json({
success:true
});

});



app.delete("/api/apps/:id",(req,res)=>{

let apps=getApps();

apps.splice(req.params.id,1);

saveApps(apps);

res.json({
success:true
});

});



app.put("/api/apps/:id",(req,res)=>{

let apps=getApps();

apps[req.params.id]=req.body;

saveApps(apps);

res.json({
success:true
});

});




// Start

app.listen(PORT,()=>{

console.log(
`Aexus running on http://localhost:${PORT}`
);

});