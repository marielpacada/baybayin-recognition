{
    const canvas = $("canvas")[0];
    const context = canvas.getContext('2d');
    const clearCanvas = $("#clear-canvas")[0]
    const predictedLetter = document.getElementById('predicted-letter');
    const top3Letter = document.getElementById('top3-letter');

    const msg1 = 'Draw an uppercase letter';
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
        predictedLetter.innerText = msg1;
        top3Letter.innerText = '';
    }

    function generateTop3String(scores) {
        let finalString = '';
        for (let score of scores) {
            finalString += `<span>${score.letter}</span>: ${(score.value * 100).toFixed(3)}% `;
        }
        return finalString.trim();
    }

    function predict(model) {
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


            predictedLetter.innerText = top3[0].letter;
            top3Letter.innerHTML = generateTop3String(top3);
        });
    }

    clearCanvas.addEventListener('click', resetText);

    tf.loadModel('model/model.json').then(setListeners);
}
