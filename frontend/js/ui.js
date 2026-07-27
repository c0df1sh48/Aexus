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


// =====================
// PIN CHANGE SYSTEM
// =====================


let pinStep = "verify";

let oldPin = "";

let newPin = "";



function openPinPopup(){

    pinStep = "verify";

    oldPin = "";

    newPin = "";


    document
    .getElementById("pinModal")
    .style.display = "flex";


    document
    .getElementById("pinTitle")
    .textContent =
    "Verify Current PIN";


    document
    .getElementById("pinButton")
    .textContent =
    "Continue";


    document
    .getElementById("pinInput")
    .value = "";


    document
    .getElementById("pinMessage")
    .textContent = "";

}




function closePinPopup(){

    document
    .getElementById("pinModal")
    .style.display = "none";

}





async function pinAction(){


    console.log(
        "PIN step:",
        pinStep
    );


    const input =
    document
    .getElementById("pinInput")
    .value;



    const message =
    document
    .getElementById("pinMessage");




    // =====================
    // VERIFY OLD PIN
    // =====================


    if(pinStep === "verify"){



        const res =
        await fetch(
            "/api/auth/login",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify({

                    pin:input

                })

            }
        );



        const data =
        await res.json();




        if(data.success){


            // SAVE OLD PIN

            oldPin = input;



            pinStep = "new";



            document
            .getElementById("pinTitle")
            .textContent =
            "Enter New PIN";



            document
            .getElementById("pinButton")
            .textContent =
            "Continue";



            document
            .getElementById("pinInput")
            .value = "";



            message.textContent = "";


        }
        else{


            message.textContent =
            "Incorrect PIN";


        }


    }





    // =====================
    // ENTER NEW PIN
    // =====================


    else if(pinStep === "new"){



        if(input.length < 4){


            message.textContent =
            "PIN must be at least 4 digits";


            return;


        }



        newPin = input;



        pinStep = "confirm";



        document
        .getElementById("pinTitle")
        .textContent =
        "Confirm New PIN";



        document
        .getElementById("pinInput")
        .value = "";



        message.textContent = "";


    }





    // =====================
    // CONFIRM NEW PIN
    // =====================


    else if(pinStep === "confirm"){



        if(input !== newPin){


            message.textContent =
            "PINs do not match";


            return;


        }




        const res =
        await fetch(
            "/api/auth/change-pin",
            {

                method:"POST",


                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify({

                    oldPin: oldPin,

                    newPin: newPin

                })

            }
        );




        const data =
        await res.json();





        if(data.success){


            message.textContent =
            "PIN changed!";



            setTimeout(()=>{


                closePinPopup();


            },1000);



        }
        else{


            message.textContent =
            data.error ||
            "Failed to change PIN";


        }



    }



}