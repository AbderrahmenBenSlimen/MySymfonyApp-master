$(document).ready(function () {
  $(".deleted_btn").on("click", function () {
    var id = $(this).data("id");
    $("#deleted_a_" + id).remove();
    var uri_path = window.location.pathname;
    $.ajax({
      type: "POST",
      url: uri_path + "/" + id,
      data: { id: id },
      success: function (response) {
        $("#deleted_date_" + id).html(response);
      },
    });
  });

  $(".active-btn").on("click", function () {
    var id = $(this).data("id");
    var uri_path = window.location.pathname;
    $.ajax({
      type: "POST",
      url: uri_path + "/" + id + "/status",
      data: { id: id },
      success: function (response) {
        /* if (response === "Activated") {
          $("#active").prop("checked", true);
        } else {
          $("#active").prop("checked", false);
        } */
      },
    });
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
  $("#role").click(function () {
    validateRole();
  });

  // Validate Email

  $("#emailcheck").hide();
  $("#email").keyup(function () {
    validateEmail();
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

  $("#product_namecheck").hide();
  $("#product_name").keyup(function () {
    validateProductName();
  });

  $("#providercheck").hide();
  $(".provider-options-container-").on("click", ".option", function () {
    $("#providercheck").hide();
  });
  $("#providerNamecheck").hide();
  $("#provider_name").keyup(function () {
    validateProviderNameInput();
  });

  $("#validateForm").submit(function (event) {
    if (enableSubmitUser()) {
      $(this).submit();
    } else {
      event.preventDefault();
    }
  });

  $("#validateFormProvider").submit(function (event) {
    if (enableSubmitProvider()) {
      $(this).submit();
    }else{
      event.preventDefault();
    }
  });

  $("#validateFormProduct").submit(function (event) {
    if (enableSubmitProduct()) {
      $(this).submit();
    } else {
      event.preventDefault();
    }
  });
   
    $('tr[data-href]').on('click' ,function() {
     
      var url = $(this).data('href');
     
      window.location.href = url;
    });

  $(".form-group").each(function () {
    var id = $(this).data("id");
    var item = $(this).data("item"); 
    selectItemKeyUp(item, id);
    if (item === "product") {
      selectItemClick(item, id);
    }
    selectItemFocusout(item, id);
    selectItem(item, id);
    $("#quantity_" + id).keyup(function () {
      var quantity = $(this).val();
      var price = $(
        ".product-select-box-" + id + " .option input[type='hidden']"
      )
        .closest(".option")
        .attr("data-price");
      $("#total_" + id).val(quantity * price);
    });
  });

  addActiveNav();
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
      "The Length of the lastname must be more than 2 characters"
    );
    return false;
  } else {
    $("#lastnamecheck").hide();
    return true;
  }
}

function validateRole() {
  let roleValue = $("#role :selected").val();
  if (roleValue.length === 0) {
    $("#rolecheck").show();
    $("#rolecheck").html("Set a user role");
    return false;
  } else {
    $("#rolecheck").hide();
    return true;
  }
}

function validateEmail() {
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
  } else {
    $("#emailcheck").hide();
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

function validateProductName() {
  let prodName = $("#product_name").val();
  if (prodName.length === 0) {
    $("#product_namecheck").show();
    $("#product_namecheck").html("Product name cannot be empty");
    return false;
  } else if (prodName.length < 3 || prodName.length > 10) {
    $("#product_namecheck").show();
    $("#product_namecheck").html(
      "The Length of the name must be at least 2 characters"
    );
    return false;
  } else {
    $("#product_namecheck").hide();
    return true;
  }
}

function validateProviderNameInput() {
  let provdName = $("#provider_name").val();
  if (provdName.length === 0) {
    $("#providerNamecheck").show();
    $("#providerNamecheck").html("Provider name cannot be empty");
    return false;
  } else if (provdName.length < 3 || provdName.length > 10) {
    $("#providerNamecheck").show();
    $("#providerNamecheck").html(
      "The Length of the name must be at least 2 characters"
    );
    return false;
  } else {
    $("#providerNamecheck").empty();
    $("#providerNamecheck").hide();
    return true;
  }
}

function isRealOrInteger(value) {
  // Use jQuery.isNumeric() to check if the value is a number or a numeric string
  if (jQuery.isNumeric(value)) {
    // Use typeof to check if the value is a "number" or a "string"
    var type = typeof value;
    // Use isFinite() to check if the value is a finite number
    var finite = isFinite(value);
    // Return true if the value is a "number" or a "string" and a finite number
    return (type === "number" || type === "string") && finite;
  } else {
    // Return false if the value is not a number or a numeric string
    return false;
  }
}
function ValidateUnitPrice() {
  let price = $("#unit_price").val();
  if (price.length === 0) {
    $("#punit_pricecheck").show();
    $("#punit_pricecheck").html("Unit Price cannot be empty");
    return false;
  } else if (!isRealOrInteger(price)) {
    $("#punit_pricecheck").show();
    $("#punit_pricecheck").html(
      "Please enter a valid unit price containing numeric values."
    );
    return false;
  } else {
    $("#punit_pricecheck").hide();
    return true;
  }
}
function enableSubmitProduct() {
  var providerNameError = validateProvider();
  var productNameError = validateProductName();
  var unitPriceError = ValidateUnitPrice();
  const isFormValid =
    productNameError === true &&
    providerNameError === true &&
    unitPriceError === true;

  if (!isFormValid) {
    return false;
  } else {
    return true;
  }
}
function enableSubmitProvider() {
  var providerNameError = validateProviderNameInput();
  if(providerNameError){
    return true;
  }else{
    false;
  }
}

function validateProvider() {
  var provider = $(".provider-selected-").html();
  if (provider.length === 0) {
    $("#providercheck").show();
    $("#providercheck").html("Provider need to be selected");
    return false;
  }
  return true;
}

function enableSubmitUser() {
  usernameError = validateUsername();
  lastnameError = validateLastname();
  roleError = validateRole();
  emailError = validateEmail();
  passwordError = validatePassword();
  confirmPasswordError = validateConfirmPassword();
  const isFormValid =
    usernameError === true &&
    lastnameError === true &&
    roleError === true &&
    emailError === true &&
    passwordError === true &&
    confirmPasswordError === true;
  if (!isFormValid) {
    return false;
  } else {
    return true;
  }
}

function enableSubmitOrder() {
  var isValid = 0;
  var emptyRow = 0;
  var cnt = 0;
  var i = 0;
  $(".loopOver tr").each(function () {
    i++;
    var provider = $(this)
      .find(".provider-selected-" + i)
      .text()
      .trim();
    var product = $(this)
      .find(".product-selected-" + i)
      .text()
      .trim();
    var quantity = $(this).find("input[name^='quantity']").val();
    var total = $(this).find("input[name^='total']").val();

    if (provider === "" || product === "" || quantity === "" || total === "") {
      if (
        provider !== "" ||
        product !== "" ||
        quantity !== "" ||
        total !== ""
      ) {
        cnt++;
      }
      if (
        provider === "" &&
        product === "" &&
        quantity === "" &&
        total === ""
      ) {
        emptyRow++;
      } else if (
        provider !== "" &&
        product !== "" &&
        quantity !== "" &&
        total !== ""
      ) {
        isValid++;
      }
    }
  });
  if (isValid === cnt && emptyRow < 5) {
    return true;
  } else {
    if (emptyRow === 5) {
      demo.initChartist();
      $.notify(
        {
          icon: "pe-7s-attention",
          message: "Oops! Veuillez remplir au moins une ligne.",
        },
        {
          type: "danger",
          timer: 200,
        }
      );
    } else if (cnt === 1) {
      demo.initChartist();
      $.notify(
        {
          icon: "pe-7s-attention",
          message:
            "Oops! Il vous manque des détails sur cette ligne. Veuillez remplir tous les champs relatifs à la ligne. ",
        },
        {
          type: "danger",
          timer: 200,
        }
      );
    } else if (cnt > 1) {
      demo.initChartist();
      $.notify(
        {
          icon: "pe-7s-attention",
          message:
            "Oops! Vous avez des lignes incomplètes. Veuillez remplir tous les champs relatifs à ces lignes.",
        },
        {
          type: "danger",
          timer: 200,
        }
      );
    }
    return false;
  }
}

function addActiveNav() {
  var currentPath = window.location.pathname;
  $(".nav li a").each(function () {
    var href = $(this).attr("href");

    if (currentPath.includes(href)) {
      $(this).parent().addClass("active");
    } else {
      $(this).parent().removeClass("active");
    }
  });
}

function initSelect(item, id = "") {
  $("." + item + "-options-container-" + id + " .option").each(function () {
    $(this).on("mousedown", function () {
      $("." + item + "-selected-" + id).empty();
      if (item === "provider") {
        var providerId = $(this).data("id");
        $(this).append(
          '<input type="hidden" name="' +
            item +
            "_" +
            id +
            '" value="' +
            providerId +
            '">'
        );
      } else {
        $(this).append(
          '<input type="hidden" name="' +
            item +
            "_" +
            id +
            '" value="' +
            $(this).find("label").html() +
            '">'
        );
        var price = $(this).data("price");
        $("#quantity_" + id).val(1);
        $("#total_" + id).val(price);
      }

      $("." + item + "-selected-" + id).html($(this).find("label").html());
      $("." + item + "-options-container-" + id).removeClass("active");
    });
  });
}

function selectItemKeyUp(item, id = "") {
  $("." + item + "-search-box-" + id + " input").keyup(function () {
    $("." + item + "-options-container-" + id).empty();
    if (item === "provider") {
      var query = $("." + item + "-search-box-" + id + " input").val();
      searchItem(item, id, null, query); // no product parameter for provider
    } else {
      var query = $(".provider-selected-" + id).html();
      var product = $("." + item + "-search-box-" + id + " input").val();
      if (query && product) {
        searchItem(item, id, product, query);
      }
    }
  });
}

function searchItem(item, id, product, query) {
  if (query != "") {
    $.ajax({
      type: "POST",
      url: "/admin/" + item + "/search/" + query,
      data: { query: query, product: product },
      async: false,
      success: function (response) {
        if (response.length == 0) {
          $("." + item + "-options-container-" + id).empty();
          if(item === "provider"){
          $("." + item + "-options-container-" + id).append(
            "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun fournisseur trouvé </label></div>"
          );
        }else{
          $("." + item + "-options-container-" + id).append(
            "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun produit trouvé </label></div>"
          );
        }
        } else {
          $("." + item + "-options-container-" + id).empty();
          $.each(response, function (index, result) {
            if (item === "provider") {
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;' data-id=" +
                  result["id"] +
                  "><input type='radio' class='radio' id='" +
                  result["name"] +
                  "' name='" +
                  item +
                  "'/><label for='" +
                  result["name"] +
                  "'>" +
                  result["name"] +
                  "</label></div>"
              );
            } else {
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;' data-price=" +
                  result["price"] +
                  "><input type='radio' class='radio' id='" +
                  result["name"] +
                  "' name='" +
                  item +
                  "'/><label for='" +
                  result["name"] +
                  "'>" +
                  result["name"] +
                  "</label></div>"
              );
            }
          });
          initSelect(item, id);
        }
      },
    });
  }
}

function selectItemClick(item, id) {
  $("." + item + "-selected-" + id).on('mousedown', function () {
    var query = $(".provider-selected-" + id).html();
    var clickedRow = $(this).closest("tr");
    var check = false;
    const products = [];
    $(".loopOver tr")
      .not(clickedRow)
      .each(function () {
        var providerInput = $(this)
          .find(".form-group[data-item='provider'] .selected")
          .html();
        if (providerInput) {
          if (query === providerInput) {
            check = true;
            product = $(this)
              .find(".form-group[data-item='product'] input[type='hidden']")
              .val();
            products.push(product);
          }
        }
      });
    if (check) {
      if (query != "") {
        $.ajax({
          type: "POST",
          url: "/admin/" + item + "/search/" + query,
          data: { query: query, products: products },
          async: false,
          success: function (response) {
            if (response.length == 0) {
              $("." + item + "-options-container-" + id).empty();
              if(item === "provider"){
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun fournisseur trouvé </label></div>"
              );
            }else{
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun produit trouvé </label></div>"
              );
            }
            } else {
              $("." + item + "-options-container-" + id).empty();
              $.each(response, function (index, result) {
                $("." + item + "-options-container-" + id).append(
                  "<div class='option' style='display: block;' data-price=" +
                    result["price"] +
                    "><input type='radio' class='radio' id='" +
                    result["name"] +
                    "' name='" +
                    item +
                    "'/><label for='" +
                    result["name"] +
                    "'>" +
                    result["name"] +
                    "</label></div>"
                );
              });
              initSelect(item, id);
            }
          },
        });
      }
    } else {
      if (query != "") {
        $.ajax({
          type: "POST",
          url: "/admin/" + item + "/search/" + query,
          data: { query: query },
          async: false,
          success: function (response) {
            if (response.length == 0) {
              $("." + item + "-options-container-" + id).empty();
            if(item === "provider"){
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun fournisseur trouvé </label></div>"
              );
            }else{
              $("." + item + "-options-container-" + id).append(
                "<div class='option' style='display: block;color:red;'><input type='radio' class='radio' id=''/><label for=''> Aucun produit trouvé </label></div>"
              );
            }
            } else {
              $("." + item + "-options-container-" + id).empty();
              $.each(response, function (index, result) {
                $("." + item + "-options-container-" + id).append(
                  "<div class='option' style='display: block;' data-price=" +
                    result["price"] +
                    "><input type='radio' class='radio' id='" +
                    result["name"] +
                    "' name='" +
                    item +
                    "'/><label for='" +
                    result["name"] +
                    "'>" +
                    result["name"] +
                    "</label></div>"
                );
              });
              initSelect(item, id);
            }
          },
        });
      }
    }
  });
}

function selectItemFocusout(item, id = "") {
  $("." + item + "-search-box-" + id + " input").focusout(function () {
    $("." + item + "-options-container-" + id).removeClass("active");
  });
}

function selectItem(item, id = "") {
  const selected = $("." + item + "-selected-" + id);
  const optionsContainer = $("." + item + "-options-container-" + id);
  const searchBox = $("." + item + "-search-box-" + id + " input");
  const optionsList = $(".option");

  selected.click(function () {
    // $("." + item + "-options-container-" + id).empty();
    optionsContainer.toggleClass("active");
    searchBox.val("");
    filterList("");
    if (optionsContainer.hasClass("active")) {
      searchBox.focus();
    }
  });

  initSelect(item, id);

  searchBox.keyup(function (e) {
    filterList(e.target.value);
  });

  const filterList = (searchTerm) => {
    searchTerm = searchTerm.toLowerCase();
    optionsList.each(function () {
      let label = $(this).find("label").text().toLowerCase();
      if (label.indexOf(searchTerm) != -1) {
        $(this).css("display", "block");
      } else {
        $(this).css("display", "none");
      }
    });
  };
}