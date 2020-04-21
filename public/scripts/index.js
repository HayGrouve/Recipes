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



