$(function () {
    const canvas = $("canvas")[0];
    const context = canvas.getContext('2d');
    const predictedLetter = $(".predicted-letter");
    const comment = $(".comment");
    const top3Letter = $('.top-three');
    const letterPlaceholder = $(".predicted-letter").text();
    const commentPlaceholder = $(".comment").text();
    const top3Placeholder = $('.top-three').text();
    var $char;

    const classes = ['a', 'b', 'ba', 'be_bi', 'bo_bu', 'd', 'da_ra', 'de_di',
        'do_du', 'e_i', 'g', 'ga', 'ge_gi', 'go_gu', 'h', 'ha', 'he_hi', 'ho_hu',
        'k', 'ka', 'ke_ki', 'ko_ku', 'l', 'la', 'le_li', 'lo_lu', 'm', 'ma', 'me_mi',
        'mo_mu', 'n', 'na', 'ne_ni', 'ng', 'nga', 'nge_ngi', 'ngo_ngu', 'no_nu', 'o_u',
        'p', 'pa', 'pe_pi', 'po_pu', 'r', 'ra', 're_ri', 'ro_ru', 's', 'sa', 'se_si',
        'so_su', 't', 'ta', 'te_ti', 'to_tu', 'w', 'wa', 'we_wi', 'wo_wu', 'y', 'ya',
        'ye_yi', 'yo_yu'];


    function setListeners(model) {
        canvas.addEventListener('mouseup', () => predict(model));
    }

    function resetText() {
        predictedLetter.text(letterPlaceholder);
        top3Letter.text(top3Placeholder);
        comment.text(commentPlaceholder);
        comment.css('color', 'white');
    }

    function generateTop3String(scores) {
        let finalString = '';
        for (let score of scores) {
            finalString += `<span>${score.letter}</span>: ${(score.value * 100).toFixed(3)}% `;
        }
        return finalString.trim();
    }

    function predict(model) {
        if ($char) {
            let canvasPixels = context.getImageData(0, 0, canvas.width, canvas.height);
            let canvasPixelsTensor = tf.fromPixels(canvasPixels, 1);
            canvasPixelsTensor = tf.image.resizeBilinear(canvasPixelsTensor, [28, 28]);
            canvasPixelsTensor = canvasPixelsTensor.toFloat().mul(tf.tensor1d([1 / 255])).expandDims(0);

            let results = model.predict(canvasPixelsTensor);
            results.data().then(data => {
                data = Array.from(data);
                let letterScores = data.map((elem, i) => {
                    return {
                        letter: classes[i],
                        value: elem
                    };
                });
                letterScores.sort((a, b) => b.value - a.value);
                let top3 = letterScores.slice(0, 3);

                predictedLetter.text(top3[0].letter);
                top3Letter.html(generateTop3String(top3));
                generateComment();
            });
        }
    }

    function generateComment() {
        const results = top3Letter.text();
        const topResult = results.split(":")[0];
        if (topResult === $char.text()) {
            comment.text("good job!");
            comment.css("color", "#C6FBD2");
        } else {
            comment.text("try again.");
            comment.css("color", "#FFC6C2");
        }
    }

    $(".dropdown-item").click(function () {
        $char = $(this);
        const imageFolder = "chosen-images/";
        const charImage = imageFolder + $char.text() + ".jpg";
        $(".chosen-img").css("background-image", "url(" + charImage + ")")
        $(".chosen-char").text($char.text());
        resetText();
    });

    tf.loadModel('model/model.json').then(setListeners);
});
