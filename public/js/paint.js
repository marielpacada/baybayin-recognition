const canvas = $("canvas")[0];
const context = canvas.getContext('2d');
const predictedLetter = $(".predicted-letter");
const comment = $(".comment");
const top3Letter = $('.top-three');
const letterPlaceholder = $(".predicted-letter").text();
const commentPlaceholder = $(".comment").text();
const top3Placeholder = $('.top-three').text();
const radius = 8;
let painting = false;

function paintBackground() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
}

function putPoint(e) {
    if (!painting) return;
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    context.beginPath();
    context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
}

function startStroke(e) {
    painting = true;
    putPoint(e);
}

function endStroke() {
    painting = false;
    context.beginPath();
}

function resetText() {
    predictedLetter.text(letterPlaceholder);
    top3Letter.text(top3Placeholder);
    comment.text(commentPlaceholder);
    comment.css('color', 'white');
}

canvas.width = 200;
canvas.height = 200;
context.lineWidth = radius * 2;
context.strokeStyle = 'white';

paintBackground();

canvas.addEventListener('mousedown', startStroke);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', endStroke);
canvas.addEventListener('mouseleave', endStroke);

$(".clear-btn").click(function() { 
    paintBackground();
    resetText();
});
$(".dropdown-item").click(() => paintBackground());