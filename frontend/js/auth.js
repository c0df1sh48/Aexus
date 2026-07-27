async function checkAuth(){

    const res = await fetch("/api/auth/check");

    const data = await res.json();


    if(!data.authenticated){

        window.location.href = "index.html";

    }

}
async function logout(){

    await fetch("/api/auth/logout", {
        method:"POST"
    });


    window.location.href = "index.html";

}

checkAuth();