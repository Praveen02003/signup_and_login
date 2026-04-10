// get data from localstorage
let userData = JSON.parse(localStorage.getItem('userdata')) || {};
// console.log(userData);

// target login form
const loginForm = document.getElementById('loginForm');

// add form submit event
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let userData = JSON.parse(localStorage.getItem('userdata')) || {};
    let isValid = true;

    // get all input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // email validation
    if (!email) {
        document.getElementById('emailError').textContent = 'Enter Email';
        isValid = false;
    } else {
        document.getElementById('emailError').textContent = "";
    }
    // password validation
    if (!password) {
        document.getElementById('passwordError').textContent = "Enter Password";
        isValid = false;
    } else {
        document.getElementById('passwordError').textContent = "";
    }

    // final validation to login
    if (isValid) {
        if (userData[email]) {

            // check password
            if (userData[email].password === password) {

                alert('Login Success');

                // store login user in localstorage
                localStorage.setItem('loginuser', JSON.stringify(userData[email]));

                setTimeout(() => {
                    window.location.href = '/dashboard/index.html';
                }, 500);

            } else {
                alert('Password Mismatch');
            }

        } else {
            alert("Invalid Credentials");
        }
    }
});

// email validation

var email = document.getElementById('email');

email.addEventListener('input', (event) => {

    var inputvalue = event.target.value;

    var emailError = document.getElementById('emailError');
    if (!inputvalue) {
        emailError.textContent = 'Enter Email';
    }
    else {
        emailError.textContent = "";
    }
});

// pasword validation

var password = document.getElementById('password');

password.addEventListener('input', (event) => {

    var inputvalue = event.target.value;

    var passwordError = document.getElementById('passwordError');
    if (!inputvalue) {
        passwordError.textContent = 'Enter Password';
    }
    else {
        passwordError.textContent = "";
    }
});


// auth login function ( prevent page )
function authLogin() {
    const loginUser = JSON.parse(localStorage.getItem('loginuser'));

    if (loginUser !== null) {
        window.location.href = '/dashboard/index.html';
    }
}

// initial call when page loads
authLogin();