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
