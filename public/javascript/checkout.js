Stripe.setPublishableKey('pk_test_51IaKWrF3UDMLO7wfjlTTRDnztOJRbUiK0jCDVmL5XnnMFTE9iHQtsMJXO6BHj2kZEPD3mZokNcd6hrsiksLObCGU00uOHk5Ury');
console.log('I can find the script');
var $ = jQuery.noConflict();

const $form = $('#checkout-form');
$form.submit(function(event) {
    //     event.preventDefault();
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disable', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiration-month').val(),
        exp_year: $('#card-expiration-year').val(),
        name: $('#card-name').val()
    }, stripResponseHandler);
    return false;
});

function stripResponseHandler(status, response) {
    if (response.error) {
        //show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disable', false);
    } else {
        //Token was created
        // Get the Token ID:
        const token = response.id;
        //Insert the token into the form so that it gets submitted to the server;
        $form.append($(`<input type="hidden" name="stripeToken" />`).val(token));

        //     submit the form
        $form.get(0).submit();
    }
}