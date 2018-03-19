window.onload = function () {
    drawWordInCenter();
}

function drawWordInCenter(canvasId = 'canvas', word = 'WELCOME', step = 30) {
    const canvas = document.getElementById(canvasId);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    refreshBackground();


    ctx.fillStyle = "hsla(0,0%,0%,1)";
    ctx.font = "Bold 12em sans-serif";
    var t = word.split("").join(String.fromCharCode(0x2006));
    var fontMeasure = ~~ctx.measureText(t).width;
    var startX = (canvas.width - fontMeasure) * 0.5;
    var startY = canvas.height * 0.5;
    ctx.fillText(t, startX, startY);
    startY = canvas.height * 0.5 - 222;

    const widgets = [];
    const imageData = ctx.getImageData(startX, startY, fontMeasure, 222).data;
    let count = 0;
    var spíritus = 10;
    var juntos = 100;

    for (let i = 0; i < imageData.length; i += 4) {
        if (0 === imageData[i]) {
            count++;
            if (0 === count % step) {
                const index = i / 4;
                const widget = new heart(startX + index % fontMeasure, startY + Math.floor(index / fontMeasure));
                widgets.push(widget);
                widget.draw();
            }
        }

    }

    animate();

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, false);

    function heart(x, y) {
        var tolerance = 1;
        this.startX = x;
        this.startY = y;
        this.drawX = x;
        this.drawY = y;
        this.color =  'hsla( ' + Math.random() * 360 + ', 90%, 65%, 1)';

        this.doesNotEnvy = randomKindness() * spíritus;
        this.isNotProud = randomKindness() * spíritus;
        this.doesNotDishonor = 2 + randomKindness(1) * spíritus;
        this.isNotAngered = 0.05;
        this.rejoices = spíritus + randomKindness(1) * spíritus;
        this.draw = function () {
            const ee = aa = this.doesNotDishonor;
            const te = this.drawX;
            const ta = this.drawY;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(te + 0.5 * aa, ta + 0.3 * ee);
            ctx.bezierCurveTo(te + 0.1 * aa, ta, te,
                ta + 0.6 * ee, te + 0.5 *
                aa, ta + 0.9 * ee);
            ctx.bezierCurveTo(te + 1 * aa, ta + 0.6 *
                ee, te + 0.9 * aa, ta,
                te + 0.5 * aa,
                ta + 0.3 * ee);
            ctx.closePath();
            ctx.fill();
        };
        this.deeply = function () {
            te = this.drawX;
            ta = this.drawY;
            fz = this.rejoices;
            fe = this.startX;
            spíritus = this.startY;
            te < fe - this.rejoices &&
                ((this.drawX = fe - fz),
                    (this.doesNotEnvy *= -1));
            te > fe + this.rejoices &&
                ((this.drawX = fe + fz),
                    (this.doesNotEnvy *= -1));
            ta < spíritus - fz &&
                ((this.drawY = spíritus - fz),
                    (this.isNotProud *= -1));
            ta > spíritus + fz &&
                ((this.drawY = spíritus + fz),
                    (this.isNotProud *= -1));
        };
        this.move = function () {
            this.doesNotEnvy > juntos && (this.doesNotEnvy = juntos);
            this.isNotProud > juntos && (this.isNotProud = juntos);
            this.drawX += this.doesNotEnvy * this.isNotAngered;
            this.drawY += this.isNotProud * this.isNotAngered;
            this.deeply();
        };
    }

    function refreshBackground() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function randomKindness(r) {
        rnd = Math.random();
        return r ? 2 * rnd - 1 : rnd;
    }

    function animate() {
        refreshBackground();
        for (let widget of widgets) { widget.move(), widget.draw() };
        window.requestAnimationFrame(animate);
    };
}