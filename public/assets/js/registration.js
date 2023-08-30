$(document).ready( function () {
  const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");

home.classList.add("show");
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});



$(".deleted_btn").on("click", function () {
  var id = $(this).data("id");
  $("#deleted_a_" + id).remove();
  
});


  // Validate Username
  $("#namecheck").hide();
  $("#name").keyup(function () {
    validateUsername();
  });

  // Validate Lastname
  $("#lastnamecheck").hide();
  $("#lastname").keyup(function () {
    validateLastname();
  });

  // Validate Role
  $("#rolecheck").hide();
  $("#role").keyup(function () {
    validateRole();
  });

  // Validate Email

  $("#emailcheck").hide();
  $("#email").keyup(function () {
    var email = $(this).val();
    let valid = true; 
    validateEmail(valid);
  });
  $("#email").focusout(function () {
    var email = $(this).val();
    let valid = false; 
    $.ajax({
      type: "POST",
      url: "/register/mailcheck/" + email,
      data: { email: email },
      success: function (response) {
        if(response == "Exist")
        {
          valid = true
        }
        validateEmail(valid);
      },
    });
  });



  // Validate Password
  $("#passcheck").hide();
  $("#password").keyup(function () {
    validatePassword();
  });

  // Validate Confirm Password
  $("#conpasscheck").hide();
  $("#password_confirmation").keyup(function () {
    validateConfirmPassword();
  });

  $("#register").submit(function (event) {
    if (enableSubmitButton()) {
      $(this).submit();
    } else {
      event.preventDefault();
    }
  });

});


function validateUsername() {
  let usernameValue = $("#name").val();
  if (usernameValue.length === 0) {
    $("#namecheck").show();
    $("#namecheck").html("Username cannot be empty");
    return false;
  } else if (usernameValue.length < 3 || usernameValue.length > 10) {
    $("#namecheck").show();
    $("#namecheck").html("Name lenght must be between 3 and 10");
    return false;
  } else {
    $("#namecheck").hide();
    return true;
  }
}

function validateLastname() {
  let lastnameValue = $("#lastname").val();
  if (lastnameValue.length === 0) {
    $("#lastnamecheck").show();
    $("#lastnamecheck").html("Lastname cannot be empty");
    return false;
  } else if (lastnameValue.length < 3 || lastnameValue.length > 12) {
    $("#lastnamecheck").show();
    $("#lastnamecheck").html(
      "Lastname length must be more than 2 characters"
    );
    return false;
  } else {
    $("#lastnamecheck").hide();
    return true;
  }
}


function validateEmail(valid) {
  let email = $("#email").val();

  let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  if (email.length === 0) {
    $("#emailcheck").html("Email cannot be empty");
    $("#emailcheck").show();
    return false;
  } else if (!regex.test(email)) {
    $("#emailcheck").html("Enter a valid email");
    $("#emailcheck").show();
    return false;
  } else if(valid){
    $("#emailcheck").show();
    $("#emailcheck").html("Email address already taken");
    return false;
  }
  else {
    $("#emailcheck").hide();
    $("#emailcheck").empty();
    return true;
  }
}

function validatePassword() {
  let passwordValue = $("#password").val();
  if (passwordValue.length === 0) {
    $("#passcheck").html("Password cannot be empty");
    $("#passcheck").show();
    return false;
  }
  if (passwordValue.length < 3 || passwordValue.length > 10) {
    $("#passcheck").html("Length of your password must be between 3 and 10");
    $("#passcheck").show();
    return false;
  } else {
    $("#passcheck").hide();
    return true;
  }
}
function validateConfirmPassword() {
  let confirmPasswordValue = $("#password_confirmation").val();
  let passwordValue = $("#password").val();
  if (passwordValue != confirmPasswordValue) {
    $("#conpasscheck").show();
    $("#conpasscheck").html("Password didn't Match");
    return false;
  } else {
    $("#conpasscheck").hide();
    return true;
  }
}
function enableSubmitButton() {
  usernameError = validateUsername();
  lastnameError = validateLastname();
  if($("#emailcheck").html()){
    emailError = false;
  }else{
    emailError = true;
  }
  
  passwordError = validatePassword();
  confirmPasswordError = validateConfirmPassword();
  const isFormValid =
    usernameError === true &&
    lastnameError === true &&
    emailError === true &&
    passwordError === true &&
    confirmPasswordError === true;
  if (!isFormValid) {
    return false;
  } else {
    return true;
  }
}