// focus on first text field on page load
$("#name").focus();

// hide some parts of the form initially
hide($("#other-title"));
hide($("#colors-js-puns"));
hide($(".paypal"));
hide($(".bitcoin"));

// if select "other" job role, show text field to specify
$("#title").on("change", function() {
  if ($(this).val() === "other") {
    show($("#other-title"));
    $("#other-title").focus();
  } else {
    hide($("#other-title"));
  }
});

// only show t-shirt color options once a theme is selected
// and limit color dropdown options to match options for theme
$("#design").on("change", function() {
  var punsOptions = $("#color option:contains(Puns)");
  var heartOptions = $("#color option:contains(I)");
  
  if ($(this).val() === "js puns") {
    show($("#colors-js-puns"));
    show(punsOptions);
    hide(heartOptions);
    selectFirstOfThemeIfHidden("cornflowerblue");
  } else if ($(this).val() === "heart js") {
    show($("#colors-js-puns"));
    show(heartOptions);
    hide(punsOptions);
    selectFirstOfThemeIfHidden("tomato");
  } else {
    hide($("#colors-js-puns"));
  }
});

// selects the first allowable option based on theme if currently selected option is now hidden
function selectFirstOfThemeIfHidden(colorValToSelect) {
  if ($("#color option:selected").hasClass("is-hidden")) {
    $("#color").val(colorValToSelect);
  }
}

// run functions on checking checkboxes in activities list
$(".activities input").on("change", function() {
  disableSameTimeActivities($(this));
  displayTotalCost($(this));
});

// disable other activities that happen during the same time slot
function disableSameTimeActivities(checkedCheckbox) {
  if (checkedCheckbox.closest("label").text().match("day")) {
    var timeSlot = getTimeSlotFromLabel(checkedCheckbox);
    if (checkedCheckbox.closest("label").text().match(timeSlot)) {
      if (checkedCheckbox.prop("checked")) {
        $(".activities label:contains('" + timeSlot + "')").addClass("disabled");
        $(".activities label:contains('" + timeSlot + "')").children("input").prop("disabled", true);
        checkedCheckbox.closest("label").removeClass("disabled");
        checkedCheckbox.prop("disabled", false);
      } else {
        $(".activities label:contains('" + timeSlot + "')").removeClass("disabled");
        $(".activities label:contains('" + timeSlot + "')").children("input").prop("disabled", false);
      }
    }
  }
}

// display total cost of all activities, if any activities are checked
function displayTotalCost(checkedCheckbox) {
  show($(".total-cost"));
  
  var initialTotalCost = parseInt($(".total-cost span").text());
  var costForActivity = parseInt(getCostFromLabel(checkedCheckbox));
  var newTotalCost;

  if (checkedCheckbox.prop("checked")) {
    newTotalCost = initialTotalCost + costForActivity;
  } else {
    newTotalCost = initialTotalCost - costForActivity;
  }
  $(".total-cost span").text(newTotalCost);

  if (newTotalCost === 0) {
    hide($(".total-cost"));
  }
}

// pull out day and time for activity from full activity label
function getTimeSlotFromLabel(checkedCheckbox) {
  return checkedCheckbox.closest("label").text().split("—")[1].split(",")[0];
}

// pull out cost for activity from full activity label
function getCostFromLabel(checkedCheckbox) {
  return checkedCheckbox.closest("label").text().split("$")[1];
}

// show the proper section depending on the selected payment method, and hide the others
$("#payment").on("change", function() {
  if ($(this).val() === "credit card") {
    show($(".credit-card"));
    hide($(".paypal"));
    hide($(".bitcoin"));
    $("#cc-num").focus();
  } else if ($(this).val() === "paypal") {
    hide($(".credit-card"));
    show($(".paypal"));
    hide($(".bitcoin"));
  } else if ($(this).val() === "bitcoin") {
    hide($(".credit-card"));
    hide($(".paypal"));
    show($(".bitcoin"));
  }
});

// on click to submit form, validate form and show error messages, and only submit if all valid
$("form button").on("click", function(event) {
  event.preventDefault();
  if (validateForm()) {
    $("form").submit();
  } else {
    $(window).scrollTop(50);
    $("form").prepend("<h3 class='error error-instruction'>Please review the fields in red below.</h3>");
  }
});

// clear out validation error messages from prior attempt to submit,
// and validate each field displaying error messages as needed,
// return true or false depending if all fields are valid
function validateForm() {
  $("label").removeClass("error");
  $("legend").removeClass("error");
  $(".error-instruction").remove();
  var validName = validateField(isValidName(), $("#name").prev("label"), " (please provide your name)");
  var validEmail = validateField(isValidEmail(), $("#mail").prev("label"), " (please provide a valid email address)");
  var validActivities = validateField(isValidActivities(), $(".activities legend"), " (please select at least one activity)");
  var validCreditCard = validateCreditCard();
  return validName && validEmail && validActivities && validCreditCard;
}

// if credit card payment option is selected, validate credit card number, zip code, and CVV,
// return true if all valid, or if credit card not selected as payment option,
// return false if any of those fields are not valid and display error message on credit card section 
function validateCreditCard() {
  var validCreditCard;
  if ($("#payment").val() === "credit card") {
    var validCcNumber = validateField(isValidCcNumber(), $("#cc-num").prev("label"), "");
    var validCcZip = validateField(isValidCcZip(), $("#zip").prev("label"), "");
    var validCcCvv = validateField(isValidCcCvv(), $("#cvv").prev("label"), "");
    validCreditCard = validCcNumber && validCcZip && validCcCvv;
    if (!validCreditCard) {
      $("#credit-card").prepend("<p class='error error-instruction'>Please enter valid credit card information.</p>");
    }
  } else {
    validCreditCard = true;
  }
  return validCreditCard;
}

// validate a field by getting true/false from passed in function,
// return true if valid, return false if not and display passed in error instruction on passed in label field
function validateField(validator, label, errorMessage) {
  if (validator) {
    return true;
  } else {
    label.addClass("error").append("<span class='error-instruction'>" + errorMessage + "</span>");
    return false;
  }
}

// name cannot be empty
function isValidName() {
  return $("#name").val().length > 0;
}

// email address must be in valid format, matching email regular expression
function isValidEmail() {
  var emailRegEx = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
  return $("#mail").val().match(emailRegEx);
}

// at least one activity must be checked off
function isValidActivities() {
  return $(".activities input:checked").length > 0;
}

// credit card number must be valid based on Luhn algorithm
function isValidCcNumber() {
  var ccNumber = $("#cc-num").val();
  return validateLuhn(ccNumber);
}

// zip code must be 5 digits
function isValidCcZip() {
  var zipCodeRegEx = /^\d{5}$/;
  return $("#zip").val().match(zipCodeRegEx);
}

// CVV must be 3-4 digits
function isValidCcCvv() {
  var cvvRegEx = /^\d{3,4}$/;
  return $("#cvv").val().match(cvvRegEx);
}

function hide(element) {
  element.addClass("is-hidden");
}

function show(element) {
  element.removeClass("is-hidden");
}

// check if number is valid based on Luhn algorithm
function validateLuhn(number) {
  var length = number.length;

  if (length < 13 || length > 19) {
    return false;
  }

  var sum = 0; 
  var mul = 1; 
  
  for (var i = 0; i < length; i++) {
    var digit = number.substring(length - i - 1, length - i);
    var tproduct = parseInt(digit, 10) * mul;
  
    if (tproduct >= 10) {
      sum += (tproduct % 10) + 1;
    } else {
      sum += tproduct;
    }

    if (mul === 1) {
      mul++;
    } else {
      mul--;
    }
  }

  if ((sum % 10) === 0) {
    return true;
  } else {
    return false;
  }
}
