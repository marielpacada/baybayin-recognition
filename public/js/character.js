$(function () {
    var $char;

    // show image of character for reference
    $(".dropdown-item").click(function () {
        $char =$(this);
        const imageFolder = "/chosen-images/";
        const charImage = imageFolder + $char.text() + ".jpg";
        $(".chosen-img").css("background-image", "url(" + charImage + ")")
        $(".chosen-char").text($char.text());
    });








});