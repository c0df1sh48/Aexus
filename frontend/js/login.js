let setupMode = false;


// Check if Aexus has a PIN
async function checkSetup(){

    const res = await fetch("/api/auth/status");

    const data = await res.json();

    setupMode = !data.setup;


    if(setupMode){

        document.getElementById("title").textContent =
        "Create PIN";

        document.getElementById("button").textContent =
        "Create PIN";

    }
    else{

        document.getElementById("title").textContent =
        "Enter PIN";

        document.getElementById("button").textContent =
        "Unlock";

    }

}



// Login / Setup button

async function submitPin(){

    const pin =
    document.getElementById("pin").value;


    const endpoint =
    setupMode
    ? "/api/auth/setup"
    : "/api/auth/login";



    const res =
    await fetch(endpoint,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            pin
        })

    });



    const data =
    await res.json();



    if(data.success){

        window.location =
        "dashboard.html";

    }

    else{

        document.getElementById("error").textContent =
        data.error || "Something went wrong";

    }

}



checkSetup();