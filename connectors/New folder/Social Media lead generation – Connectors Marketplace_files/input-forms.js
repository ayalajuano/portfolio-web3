"use strict";
var inputErrorClass = "input-validation-error";
var invalidEmailErrorMessage = "";
var emptyErrorMessage = "* This field is mandatory.";
jQuery(function () {
    /* Customer sign up section*/
    $(document).on('click', '.hs-get-access-btn', function (e) {
        e.preventDefault();
        var $self = $(this);

        /*check for required fields*/
        if (HasEmptyFields()) {
            $("#empty-field-summary").css('visibility', 'visible');
            return false;
        }

        /* check for business email field */
        var businessEmailAddress = $("#BusinessEmail").val().trim();
        if (businessEmailAddress.length > 0) {
            if ((IsEmailValid(businessEmailAddress)) && (isBlockedEmail(businessEmailAddress))) {
                $("span[data-valmsg-for='BusinessEmail']").text('');
                $(this).removeClass(inputErrorClass);
                $('.hs-error-msg').addClass('hidden');
            } else {
                $("span[data-valmsg-for='BusinessEmail']").text(invalidEmailErrorMessage);
                $(this).addClass(inputErrorClass);
                $('.hs-error-msg').removeClass('hidden');
                return false;
            }

        }
        if (IsEmailValid(businessEmailAddress) == false) {
            $("#BusinessEmail").addClass(inputErrorClass)
            $("span[data-valmsg-for='BusinessEmail']").text(invalidEmailErrorMessage);
            return false;
        }

        //if (IsEmailisBlockedEmailValid(businessEmailAddress) == false) {
         //   $("#BusinessEmail").addClass(inputErrorClass)
          //  $("span[data-valmsg-for='BusinessEmail']").text(invalidEmailErrorMessage);
           // return false;
       // }


        //
        $self.prop("disabled", true);
        var form = $(this).closest('form');
        var url = $(form).attr('action');
        var serializedData = $(form).serialize();

        $.post(url, serializedData)
         .done(function (response) {
             $self.prop("disabled", false);
             $('.hs-sign-up-section').html(response);
         })
        .fail(function (xhr, status, error) {
            $self.prop("disabled", false);
            alert("An error occured during processing! Try again!")
            console.log(error);
        });
        //
    });

    if ($('.hs-error-msg .hs-error-content span').text() == '') {
        $('.hs-error-msg').addClass('hidden');
    }

    $(document).on("blur", "#BusinessEmail", function () {

        if (this.value.trim().length > 0) {
            if ((IsEmailValid(this.value.trim())) && (isBlockedEmail(this.value.trim()))) {
                $("span[data-valmsg-for='BusinessEmail']").text('');
                $(this).removeClass(inputErrorClass);
                $('.hs-error-msg').addClass('hidden');
            } else {
                $("span[data-valmsg-for='BusinessEmail']").text(invalidEmailErrorMessage);
                $(this).addClass(inputErrorClass);
                $('.hs-error-msg').removeClass('hidden');
            }

        }
        else {
            //remove previous error message
            $('.hs-error-msg').addClass('hidden');
        }
    });
    function HasEmptyFields() {
        var hasEmptyFields = false;
        $(".hs-sign-up-form input[type=text]").each(function () {
            if (this.value.trim().length == 0 && this.getAttribute('data-placeholder') != "Password") {
                console.log(this);
                $("span[data-valmsg-for='" + this.name + "']").text(this.getAttribute('data-placeholder') + " can't be null.");
                hasEmptyFields = true;
            } else {
                if (this.name != "BusinessEmail") {
                    $("span[data-valmsg-for='" + this.name + "']").text("");
                }
            }
        });
        return hasEmptyFields;
    }
    /*END Customer sign up section*/

    /*Hide business email error tooltip when empty*/

    /* HELPERS */
    /* input onfocus/blur */
    $('input').focus(function () {
        if (this.value.trim().length == 0) {
            //$(this).attr('placeholder', '');
        }
    })

    $('input').blur(function () {
        if (this.value.trim().length == 0) {
            $(this).attr('placeholder', $(this).attr('data-placeholder'));
        }
    })

    /* Validate given email address*/
    function IsEmailValid(emailAddress) {
        var isValid = false;
        var emailRegex = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
        if (emailRegex.test(emailAddress)) {
            isValid = true;
           
        }
        invalidEmailErrorMessage = "Invalid email format!";
        return isValid;
    }

    /*Block public email*/
    function isBlockedEmail(emailAddress) {

        var blocked = ["me.", "mac.", "icloud.", "gmail.", "googlemail.", "hotmail.",
                      "live.", "msn.", "outlook.", "yahoo.", "ymail.", "aol."];
        for (var i = 0; i < blocked.length; i++) {
            if (emailAddress.indexOf(blocked[i]) != -1) {
                invalidEmailErrorMessage = "Please enter a valid business email address";
                return false;                
            }
        }
        
        return true;

    }


    /* Telephone Mask */
    if ($('#PhoneNumber').length > 0) {

        $('#PhoneNumber').change(function () {
            $('#PhoneNumber').val($('#PhoneNumber').val().replace(/[^0-9]+/, ''));
        });
        $('#PhoneNumber').keyup(function () {
            $('#PhoneNumber').val($('#PhoneNumber').val().replace(/[^0-9]+/, ''));
        });

        $('#PhoneNumber').change();
    }
    /*END HELPERS */
});
