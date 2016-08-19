// focus on first text field on page load
$("#name").focus();

// if select "other" job role, show text field to specify
$("#title").on("change", function() {
  if ($(this).val() === "other") {
    $("#other-title").removeClass("is-hidden").focus();
  } else {
    $("#other-title").addClass("is-hidden");
  }
});

// limit t-shirt color dropdown options to match options for theme
$("#design").on("change", function() {
  var punsOptions = $("#color option:contains(Puns)");
  var heartOptions = $("#color option:contains(I)");
  
  if ($(this).val() === "js puns") {
    punsOptions.removeClass("is-hidden");
    heartOptions.addClass("is-hidden");
    selectFirstOfThemeIfHidden("cornflowerblue");
  } else if ($(this).val() === "heart js") {
    heartOptions.removeClass("is-hidden");
    punsOptions.addClass("is-hidden");
    selectFirstOfThemeIfHidden("tomato");
  } else {
    heartOptions.removeClass("is-hidden");
    punsOptions.removeClass("is-hidden");
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
  $(".total-cost").removeClass("is-hidden");
  
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
    $(".total-cost").addClass("is-hidden");
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
