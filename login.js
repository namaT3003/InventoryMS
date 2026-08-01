let formThing = document.getElementById("myForm");

formThing.addEventListener("submit", loginUser);

async function loginUser(event){

    event.preventDefault();

    let emailValue = document.getElementById("mailBox").value;
    let passwordValue = document.getElementById("passBox").value;

    if(emailValue === "" || passwordValue === ""){

        alert("Please fill all the fields.");

        return;

    }

    let answer = await fetch("http://localhost:5000/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email:emailValue,
            password:passwordValue

        })

    });

    if(answer.ok){

        let data = await answer.json();

        localStorage.setItem("userId", data.userId);

        localStorage.setItem("fullName", data.fullName);

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    }
    else{

        let message = await answer.text();

        alert(message);

    }

}