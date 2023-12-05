const url = "http://localhost:5678/api/users/login";

// Login user
let loginUser = async () => {
    // Get input informations
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Call API to login user with email and password informations
    let login = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    });

    let data = await login.json();
    
    // If token is not undefined, redirect to home page with edit
    if (data.token != undefined) {
        window.localStorage.setItem("token", data.token);
        window.location.href = "http://localhost:5500";
    }
    // Else, display error message
    else {
        document.querySelector(".error").innerHTML = "Erreur dans l'identifiant ou le mot de passe.";
    }
};

const submit = document.querySelector(".login-btn");

// On click on submit button, call loginUser function
submit.addEventListener("click", (event) => {
    loginUser(); // Login user

    // Cancel page redirection
    event.preventDefault();
});