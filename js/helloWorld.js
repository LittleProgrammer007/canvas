window.onload = function () {
    window.cancelDrawWord = drawWordInCenter();
}

function drawWordInCenter(canvasId = 'canvas', word = 'WELCOME', step = 30) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const widgets = [];
    let animationId = null;

    function _init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        refreshBackground();

        ctx.fillStyle = "hsla(0,0%,0%,1)";
        ctx.font = "Bold 12em sans-serif";
        var t = word.split("").join(String.fromCharCode(0x2006));
        var fontMeasure = ~~ctx.measureText(t).width;
        var startX = (canvas.width - fontMeasure) * 0.5;
        var startY = canvas.height * 0.5;
        ctx.fillText(t, startX, startY);
        startY = canvas.height * 0.5 - 222;

        const imageData = ctx.getImageData(startX, startY, fontMeasure, 222).data;
        let count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            if (0 === imageData[i]) {
                count++;
                if (0 === count % step) {
                    const index = i / 4;
                    const widget = new Widget(startX + index % fontMeasure, startY + Math.floor(index / fontMeasure));
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
    }

    function Widget(x, y) {
        this.startX = x;
        this.startY = y;
        this.drawX = x;
        this.drawY = y;
        this.color = 'hsla( ' + Math.random() * 360 + ', 90%, 65%, 1)';
        this.degree = 0.05;
        this.maxOffset = randomInt(10);
        this.offsetX = randomInt(8);
        this.offsetY = randomInt(8);
        this.maxDiff = randomInt(10);
        this.radian = 2 + randomInt(10);
    }

    Widget.prototype = {
        draw: function () {
            const diffY = diffX = this.radian;
            const x = this.drawX;
            const y = this.drawY;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(x + 0.5 * diffX, y + 0.3 * diffY);
            ctx.bezierCurveTo(x + 0.1 * diffX, y, x,
                y + 0.6 * diffY, x + 0.5 *
                diffX, y + 0.9 * diffY);
            ctx.bezierCurveTo(x + 1 * diffX, y + 0.6 *
                diffY, x + 0.9 * diffX, y,
                x + 0.5 * diffX,
                y + 0.3 * diffY);
            ctx.closePath();
            ctx.fill();
        },
        move: function () {
            if (this.offsetX > this.maxOffset) {
                this.offsetX = this.maxOffset;
            }

            if (this.offsetY > this.maxOffset) {
                this.offsetY = this.maxOffset;
            }

            this.drawX += this.offsetX * this.degree;
            this.drawY += this.offsetY * this.degree;

            this.check();
        },
        check: function () {
            const x = this.drawX;
            const y = this.drawY;

            const maxDiff = this.maxDiff;

            const startX = this.startX;
            const startY = this.startY;

            if (x < startX - maxDiff) {
                this.drawX = startX - maxDiff;
                this.offsetX *= -1;
            }

            if (x > startX + maxDiff) {
                this.drawX = startX + maxDiff;
                this.offsetX *= -1;
            }

            if (y < startY - maxDiff) {
                this.drawY = startY - maxDiff;
                this.offsetY *= -1;
            }

            if (y > startY + maxDiff) {
                this.drawY = startY + maxDiff;
                this.offsetY *= -1;
            }

        }
    }

    function refreshBackground() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        refreshBackground();
        for (let widget of widgets) {
            widget.move();
            widget.draw();
        }
        animationId = window.requestAnimationFrame(animate);
    }

    function cancelAnimation() {
        window.cancelAnimationFrame(animationId);
    }

    _init();

    return cancelAnimation;
}

function randomInt(max = 10) {
    return Math.ceil(Math.random() * max);
}
