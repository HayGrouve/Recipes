//Delete button
$('.deleteBtn').click(function () {
        const ans = confirm('Do you want to delete this recepe?');
        if (ans) {
                $('#delete-form').submit();
        }
});

//Fading the toggle
$(".fa-plus").click(function () {
        $('#form').fadeToggle(300);
});

//Toggler
var open = false;
$('#toggler').click(function () {
        if (open) {
                open = false;
                $('#toggler-icon').removeClass("fa-chevron-up").addClass("fa-chevron-down");
        } else {
                open = true;
                $('#toggler-icon').removeClass("fa-chevron-down").addClass("fa-chevron-up");
        }

});



