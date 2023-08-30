$(document).ready(function () {
  
  $("#submit").prop("disabled", true);

  // Validate Username
  $("#namecheck").hide();
  let usernameError = true;
  $("#name").keyup(function () {
    validateUsername();

  });

  

  // Validate Lastname
  $("#lastnamecheck").hide();
  let lastnameError = true;
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
    validateEmail();

  });

  // Validate Password
  $("#passcheck").hide();
  let passwordError = true;
  $("#password").keyup(function () {
    validatePassword();
   
  });

  // Validate Confirm Password
  $("#conpasscheck").hide();
  $("#password_confirmation").keyup(function () {
    validateConfirmPassword();
 
  });

  $("#validateForm").submit(function (event) {
    event.preventDefault();

    validateUsername();
    validateLastname();
    validateRole();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    enableSubmitButton();
  });
});


function validateUsername() {
  let usernameValue = $("#name").val();
  if (usernameValue.length === 0) {
    $("#namecheck").show();
    $("#namecheck").html("Username cannot be empty");
    usernameError = false;
    return false;
  } else if (usernameValue.length < 3 || usernameValue.length > 10) {
    $("#namecheck").show();
    $("#namecheck").html("The Length of the name must be between 3 and 10");
    usernameError = false;
    return false;
  } else {
    $("#namecheck").hide();
  }
}

function validateLastname() {
  let lastnameValue = $("#lastname").val();
  if (lastnameValue.length === 0) {
    $("#lastnamecheck").show();
    $("#lastnamecheck").html("Lastname cannot be empty");
    lastnameError = false;
    return false;
  } else if (lastnameValue.length < 3 || lastnameValue.length > 12) {
    $("#lastnamecheck").show();
    $("#lastnamecheck").html(
      "The Length of the lastname must be more than 2 characters"
    );
    lastnameError = false;
    return false;
  } else {
    $("#lastnamecheck").hide();
  }
}

function validateRole() {
  let roleValue = $("#role").val();
  if (roleValue.length === 0) {
    $("#rolecheck").show();
    $("#rolecheck").html("You need to set a role for the user");
    roleError = false;
    return false;
  } else {
    $("#rolecheck").hide();
  }
}

function validateEmail() {
  let email = $("#email").val();

  let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  if (email.length === 0) {
    $("#emailcheck").show();
    $("#emailcheck").html("Username cannot be empty");
    emailError = false;
    return false;
  } else if (!regex.test(email)) {
    $("#emailcheck").html("Enter a valid email");
    $("#emailcheck").show();
    emailError = false;
    return false;
  } else {
    $("#emailcheck").hide();
    emailError = true;
  }
}

function validatePassword() {
  let passwordValue = $("#password").val();
  if (passwordValue.length === 0) {
    $("#passcheck").html("Password cannot be empty");
    passwordError = false;
    return false;
  }
  if (passwordValue.length < 3 || passwordValue.length > 10) {
    $("#passcheck").html("Length of your password must be between 3 and 10");
    $("#passcheck").show();
    passwordError = false;
    return false;
  } else {
    $("#passcheck").hide();
  }
}
function validateConfirmPassword() {
  let confirmPasswordValue = $("#password_confirmation").val();
  let passwordValue = $("#password").val();
  if (passwordValue != confirmPasswordValue) {
    $("#conpasscheck").show();
    $("#conpasscheck").html("Password didn't Match");
    confirmPasswordError = false;
    return false;
  } else {
    $("#conpasscheck").hide();
  }
}
/* function enableSubmitButton() {
      const isFormValid =
        usernameError === true && lastnameError === true && emailError === true && passwordError ===true && confirmPasswordError === true;
  
  
      $("#submit").prop("disabled", !isFormValid);
    } */
function enableSubmitButton() {
  const isFormValid =
    usernameError === true &&
    lastnameError === true &&
    roleError === true &&
    emailError === true &&
    passwordError === true &&
    confirmPasswordError === true;
  if(! isFormValid )
  {
    alert("no");
    
  }else{
    $("#submit").submit();
  }
  
}




$("#validateForm").validate({
    
  rules: {
    
    name: {
      required: true
    },

    lastname: {
      required: true
    },
   
    role: {
      required: true
    },
   
    email: {
      required: true,
      email: true
    },
   
    password: {
      required: true,
      minlength: 8
    },
   
    password_confirmation: {
      required: true,
      equalTo: "#password"
    }
  },
  messages: {
    
    name: {
      required: "Veuillez entrer votre nom"
    },
   
    lastname: {
      required: "Veuillez entrer votre prénom"
    },
   
    role: {
      required: "Veuillez choisir un rôle d'utilisateur"
    },
   
    email: {
      required: "Veuillez entrer votre email",
      email: "Veuillez entrer une adresse email valide"
    },
   
    password: {
      required: "Veuillez entrer votre mot de passe",
      minlength: "Votre mot de passe doit avoir au moins 8 caractères"
    },
    
    password_confirmation: {
      required: "Veuillez confirmer votre mot de passe",
      equalTo: "Votre mot de passe et sa confirmation doivent être identiques"
    }
  },
  
});