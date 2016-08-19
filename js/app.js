// focus on first text field on page load
$("#name").focus();

// if select "other" job role, show text field to specify
$("#title").on("change", function() {
  if ($(this).val() === "other") {
    show($("#other-title"));
    $("#other-title").focus();
  } else {
    hide($("#other-title"));
  }
});

// limit t-shirt color dropdown options to match options for theme
$("#design").on("change", function() {
  var punsOptions = $("#color option:contains(Puns)");
  var heartOptions = $("#color option:contains(I)");
  
  if ($(this).val() === "js puns") {
    show(punsOptions);
    hide(heartOptions);
    selectFirstOfThemeIfHidden("cornflowerblue");
  } else if ($(this).val() === "heart js") {
    show(heartOptions);
    hide(punsOptions);
    selectFirstOfThemeIfHidden("tomato");
  } else {
    show(heartOptions);
    show(punsOptions);
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

function hide(element) {
  element.addClass("is-hidden");
}

function show(element) {
  element.removeClass("is-hidden");
}
