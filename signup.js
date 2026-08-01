let mySignupForm = document.getElementById("myForm");

mySignupForm.addEventListener("submit", createAccount);

async function createAccount(event){

    event.preventDefault();

    let nameValue = document.getElementById("nameBox").value;
    let emailValue = document.getElementById("mailBox").value;
    let passwordValue = document.getElementById("passBox").value;

    if(nameValue === "" || emailValue === "" || passwordValue === ""){

        alert("Please fill all the fields.");

        return;

    }

    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

if(!passwordPattern.test(passwordValue)){

    alert(
        "Password must contain:\n\n" +
        "• At least 6 characters\n" +
        "• One uppercase letter\n" +
        "• One lowercase letter\n" +
        "• One number"
    );

    return;

}

    let answer = await fetch("http://localhost:5000/signup",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            fullName:nameValue,
            email:emailValue,
            password:passwordValue

        })

    });

    if(answer.ok){

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    }
    else{

        let message = await answer.text();

        alert(message);

    }

}