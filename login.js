let formThing = document.getElementById("myForm");
let emailWala = document.getElementById("mailBox");
let passWala = document.getElementById("passBox");

formThing.addEventListener("submit", function(event){

    event.preventDefault();

    let emailData = emailWala.value;
    let passData = passWala.value;

    if(emailData === "" || passData === ""){
        alert("Please fill all the fields.");
    }
    else{
        window.location.href = "dashboard.html";
    }

});