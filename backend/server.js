const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const si = require("systeminformation");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();

const PORT = process.env.PORT || 1000;


// =====================
// MIDDLEWARE
// =====================

app.use(cors());

app.use(express.json());

app.use(
    session({

        secret: "CHANGE_THIS_TO_A_RANDOM_SECRET",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        }

    })
);


// =====================
// ICON UPLOAD
// =====================

const uploadFolder = path.join(
    __dirname,
    "uploads"
);


if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(uploadFolder, {
        recursive: true
    });

}


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadFolder);

    },


    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);

        cb(
            null,
            Date.now() + ext
        );

    }

});


const upload = multer({
    storage
});


app.use(
    "/uploads",
    express.static(uploadFolder)
);


// =====================
// FRONTEND
// =====================

app.use(
    express.static(
        path.join(__dirname, "frontend")
    )
);


// =====================
// DATA FILES
// =====================

const appsFile = path.join(
    __dirname,
    "data",
    "Apps.json"
);


const pinFile = path.join(
    __dirname,
    "data",
    "pin.json"
);


// Create folders/files if missing

const dataFolder = path.join(
    __dirname,
    "data"
);


if (!fs.existsSync(dataFolder)) {

    fs.mkdirSync(dataFolder, {
        recursive: true
    });

}


if (!fs.existsSync(pinFile)) {

    fs.writeFileSync(
        pinFile,
        JSON.stringify(
            {
                pin: ""
            },
            null,
            4
        )
    );

}


if (!fs.existsSync(appsFile)) {

    fs.writeFileSync(
        appsFile,
        JSON.stringify(
            [],
            null,
            4
        )
    );

}


// =====================
// DATA FUNCTIONS
// =====================


function getApps(){

    try {

        return JSON.parse(
            fs.readFileSync(
                appsFile,
                "utf8"
            )
        );

    }
    catch(error){

        console.error(
            "Apps.json error:",
            error
        );

        return [];

    }

}



function saveApps(apps){

    fs.writeFileSync(
        appsFile,
        JSON.stringify(
            apps,
            null,
            4
        )
    );

}



function getPin(){

    return JSON.parse(
        fs.readFileSync(
            pinFile,
            "utf8"
        )
    );

}



function savePin(data){

    fs.writeFileSync(
        pinFile,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}
// =====================
// AUTH SYSTEM
// =====================


// Check if PIN exists

app.get(
    "/api/auth/status",
    (req,res)=>{

        const data = getPin();


        res.json({

            setup: data.pin !== ""

        });

    }
);




// Create first PIN

app.post(
    "/api/auth/setup",
    async(req,res)=>{

        try{


            const { pin } = req.body;


            if(!pin || pin.length < 4){

                return res.status(400).json({

                    success:false,

                    error:"PIN must be at least 4 digits"

                });

            }



            const data = getPin();



            if(data.pin !== ""){

                return res.status(400).json({

                    success:false,

                    error:"PIN already exists"

                });

            }



            const hash =
            await bcrypt.hash(
                pin,
                10
            );



            savePin({

                pin:hash

            });



            req.session.authenticated = true;



            res.json({

                success:true

            });


        }
        catch(error){

            console.error(
                "Setup error:",
                error
            );


            res.status(500).json({

                success:false

            });

        }

    }
);





// Login

app.post(
    "/api/auth/login",
    async(req,res)=>{

        try{


            const { pin } = req.body;


            const data = getPin();



            if(!data.pin){

                return res.status(400).json({

                    success:false,

                    error:"PIN not setup"

                });

            }



            const match =
            await bcrypt.compare(
                pin,
                data.pin
            );



            if(!match){

                return res.status(401).json({

                    success:false,

                    error:"Invalid PIN"

                });

            }



            req.session.authenticated = true;



            res.json({

                success:true

            });


        }
        catch(error){

            console.error(
                "Login error:",
                error
            );


            res.status(500).json({

                success:false

            });

        }

    }
);





// Logout

app.post(
    "/api/auth/logout",
    (req,res)=>{


        req.session.destroy();


        res.json({

            success:true

        });


    }
);





// Check session

app.get(
    "/api/auth/check",
    (req,res)=>{


        res.json({

            authenticated:
            req.session.authenticated || false

        });


    }
);





// =====================
// CHANGE PIN
// =====================


app.post(
    "/api/auth/change-pin",
    async(req,res)=>{

        try{


            const {
                oldPin,
                newPin
            } = req.body;



            const data = getPin();



            if(!data.pin){

                return res.status(400).json({

                    success:false,

                    error:"PIN not setup"

                });

            }



            // Verify old PIN

            const match =
            await bcrypt.compare(
                oldPin,
                data.pin
            );



            if(!match){

                return res.status(401).json({

                    success:false,

                    error:"Old PIN incorrect"

                });

            }



            if(!newPin || newPin.length < 4){

                return res.status(400).json({

                    success:false,

                    error:"New PIN must be at least 4 digits"

                });

            }




            const newHash =
            await bcrypt.hash(
                newPin,
                10
            );



            savePin({

                pin:newHash

            });



            res.json({

                success:true

            });


        }
        catch(error){

            console.error(
                "Change PIN error:",
                error
            );


            res.status(500).json({

                success:false,

                error:error.message

            });

        }


    }
);
// =====================
// APP API
// =====================


app.get(
    "/api/apps",
    (req,res)=>{

        res.json(
            getApps()
        );

    }
);



app.post(
    "/api/apps",
    (req,res)=>{


        const apps = getApps();


        apps.push(
            req.body
        );


        saveApps(apps);


        res.json({

            success:true

        });


    }
);



app.put(
    "/api/apps/:id",
    (req,res)=>{


        const apps = getApps();


        apps[req.params.id] =
        req.body;


        saveApps(apps);


        res.json({

            success:true

        });


    }
);



app.delete(
    "/api/apps/:id",
    (req,res)=>{


        const apps = getApps();


        apps.splice(
            req.params.id,
            1
        );


        saveApps(apps);


        res.json({

            success:true

        });


    }
);





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
            "/uploads/" + req.file.filename

        });


    }
);





// =====================
// SYSTEM INFO
// =====================


app.get(
    "/api/system",
    async(req,res)=>{

        try{


            const cpu =
            await si.currentLoad();


            const memory =
            await si.mem();


            const disks =
            await si.fsSize();


            const os =
            await si.osInfo();


            const time =
            await si.time();


            const temp =
            await si.cpuTemperature();


            const networks =
            await si.networkStats();


            const interfaces =
            await si.networkInterfaces();



            let ip = "Unknown";



            for(const i of interfaces){


                if(

                    i.ip4 &&
                    !i.internal &&
                    i.ip4 !== "127.0.0.1" &&
                    !i.iface.toLowerCase().includes("docker")

                ){

                    ip = i.ip4;

                    break;

                }

            }




            const network =
            networks.find(
                n =>
                !n.iface
                .toLowerCase()
                .includes("docker")
            )
            ||
            networks[0];





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
                        (disks[0]?.used || 0) /
                        1024 /
                        1024 /
                        1024
                    ),


                    total:
                    Math.round(
                        (disks[0]?.size || 0) /
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
                    time.uptime / 3600
                ),



                ip,



                temperature:
                temp.main || 0,



                network:{


                    download:
                    network?.rx_sec || 0,


                    upload:
                    network?.tx_sec || 0


                },



                load:
                Number(
                    cpu.currentLoad.toFixed(1)
                )


            });


        }
        catch(error){


            console.error(
                "System info error:",
                error
            );


            res.status(500).json({

                error:
                "Failed to get system info"

            });


        }


    }
);





// =====================
// START SERVER
// =====================


app.listen(

    PORT,

    "0.0.0.0",

    ()=>{


        console.log(
            `Aexus running on port ${PORT}`
        );


    }

);