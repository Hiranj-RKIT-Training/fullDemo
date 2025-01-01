import { login } from "./api.js"
// function to store details in session
// called in 
//  -loginSignup.js on submitting form
let StoreinSession = (email, password) => {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    // sessionStorage.timeout(20)
    // setTimeout(() => {
    //     alert('Session is about to time out... Please click here to continue.');
    // }, 1000);
}

// jquery validate to validate the login form
$("#loginForm").validate({
    rules: {

        email: {
            required: true,

            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        password: {
            required: true,
            minlength: 5
        },
    }, messages: {

        email: {
            required: "Please Enter Email",
            email: "Please Enter valid Email"
        },
        password: {
            required: "Please Enter Password",
        },
    },
    submitHandler: function async() {
        console.log("submitted");
        // console.log(this);
        let email = $("#usrEmail").val();
        let pass = $("#usrPassword").val();
        StoreinSession(email, pass);
        login(email, pass);
        // console.log(email, pass);
        // $(location).attr('href', "/");
    }
});
// jquery validate to validate the login form
$("#signup").validate({
    rules: {
        firstName: {
            required: true,
        },
        lastName: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        gender: {
            required: true,
        },
        cities: {
            required: true,
        },
        usrProfilePic: {
            required: true,
        },
        password: {
            required: true,
            minlength: 5
        },
        cnfrmPassword: {
            required: true,
            equalTo: "#usrPassword"
        },
    }, messages: {
        firstName: {
            required: "Please Enter First Name",
        },
        lastName: {
            required: "Please Enter Last Name",
        },
        email: {
            required: "Please Enter Email",
            email: "Please Enter valid Email"
        },

        gender: {
            required: "Please select Gender",
        },
        cities: {
            required: "Please Select City",
        },
        usrProfilePic: {
            required: "Please add Profile pic",
        },
        password: {
            required: "Please Enter Password",
        },
        cnfrmPassword: {
            required: "Please Enter Confirm Password",
            equalTo: "Password Does not Match"
        },
    }
});
// this is an additional method created to add regex in validate
$.validator.addMethod("pattern", function (value, element, pattern) {
    return this.optional(element) || pattern.test(value);
}, "Please enter a valid value.");


