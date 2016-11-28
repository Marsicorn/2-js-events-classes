//Badigina Irina

'use strict';

const keys = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
};

function Application(prim, area, input) {
    this.hasListener = false;
    this.step = 10;

    this.stepInput = input;

    this.gameArea = area;
    this.gameAreaRect = this.gameArea.getBoundingClientRect();
    this.gameAreaHeight = this.gameAreaRect.bottom - this.gameAreaRect.top;
    this.gameAreaWidth = this.gameAreaRect.right - this.gameAreaRect.left;

    this.primitiveSize = 80;
    this.primitive = prim;
    this.primitive.style.cssText +=  'left: ' + this.gameAreaRect.left/3 + 'px;'
        + 'top: ' + this.gameAreaRect.top/3 + 'px;'
        + 'width: ' + this.primitiveSize + 'px;'
        + 'height: ' + this.primitiveSize + 'px;';

    this.primitiveRect = this.primitive.getBoundingClientRect();;
    this.left = 0;
    this.top = 0;
    this.rad = 0;

    this.movePrimitive = this.movePrimitive.bind(this);
    this.rotatePrimitive = this.rotatePrimitive.bind(this);
}

Application.prototype = {
    start: function() {
        this.getStep();
        if (!this.hasListener) {
            this.gameArea.addEventListener('keydown', this.movePrimitive);
            this.hasListener = true;
        }
    },

    stop: function() {
        if (this.hasListener) {
            this.gameArea.removeEventListener('keydown', this.movePrimitive);
            this.hasListener = false;
        }
    },

    getStep: function () {
        let numericInput = Number(/[1-9][0-9]*[0-9]/.exec(app.stepInput.value));
        this.step = numericInput / 10 < 1 ? 10 :
                    (numericInput / 50 > 1 ? 50 :
                    numericInput);
        app.stepInput.value = this.step;
    },

    movePrimitive: function() {
        let keyCode = event.keyCode;
        let shiftPressed = event.shiftKey;
        this.primitiveRect = this.primitive.getBoundingClientRect();

        switch (keyCode) {
            case keys.ARROW_UP : //up
                this.top -= (this.primitiveRect.top > this.step ?
                    this.step : this.primitiveRect.top);
                this.primitive.style.top = this.top + 'px';
                break;
            case keys.ARROW_DOWN: //down
                this.top += (this.primitiveRect.bottom + this.step < this.gameAreaHeight ?
                    this.step : this.gameAreaHeight - this.primitiveRect.bottom);
                this.primitive.style.top = this.top +'px';
                break;
            case keys.ARROW_LEFT: //left
                if (shiftPressed) { //rotate
                    this.rotatePrimitive(- this.step*Math.PI/180);
                } else { //translate
                    this.left -= (this.primitiveRect.left > this.step ?
                        this.step : this.primitiveRect.left);
                    this.primitive.style.left = this.left +'px';
                }
                break;
            case keys.ARROW_RIGHT: //right
                if (shiftPressed) {
                    this.rotatePrimitive(this.step*Math.PI/180);
                } else {
                    this.left += (this.primitiveRect.right + this.step < window.innerWidth ?
                        this.step : window.innerWidth - this.primitiveRect.right);
                    this.primitive.style.left = this.left + 'px';
                }
                break;
            default:
                break;
        }
    },

    rotatePrimitive: function(angle) {
        let _rad = this.rad;
        this.rad += angle;
        if (Math.abs(this.rad) > Math.PI/2) this.rad %= Math.PI/2;

        let primitiveHalfWidth = this.primitiveSize*(
                Math.sin(Math.abs(this.rad)) + Math.cos(Math.abs(this.rad))
            ) /2;

        let primitiveCenterX = this.primitiveRect.left + (this.primitiveRect.right - this.primitiveRect.left)/2;
        let primitiveCenterY = this.primitiveRect.top + (this.primitiveRect.bottom - this.primitiveRect.top)/2;

        if (primitiveCenterX - primitiveHalfWidth > 0
            && primitiveCenterX + primitiveHalfWidth < this.gameAreaWidth
            && primitiveCenterY - primitiveHalfWidth > 0
            && primitiveCenterY + primitiveHalfWidth < this.gameAreaHeight)
            this.primitive.style.transform = 'rotate(' + this.rad + 'rad)';
        else this.rad = _rad;
    }
};

/*--*/

const noName = 'oh no, just let me stay anonymous';
let playerName;

const app = new Application(
    document.querySelector('.primitive'),
    document.querySelector('.gameArea'),
    document.querySelector('.control__step'));

const startButton = document.querySelector('.control__start');
setStartButtonStyle(startButton);
startButton.addEventListener('click', function (event) {
    event.stopPropagation();
    app.primitive.style.visibility = 'visible';
    if (!playerName) {
        playerName = prompt('Hey! What\'s your name?', noName);
        if (playerName != noName) {
            document.querySelector('.signature').textContent = 'Malevich & ' + playerName;
        }
    }
    app.start();
});

const stopButton = document.querySelector('.control__stop');
stopButton.addEventListener('click', function (event) {
    event.stopPropagation();
    app.stop();
});
setStopButtonStyle(stopButton);

/*--*/

/*
 Я понимаю, что все изменения стиля можно и нужно вынести в css,
 но мне хотелось попробовать здесь)
 */

function setStartButtonStyle(startButton) {
    let buttonWidth = 70;
    let buttonHeight = 17;

    let cssBasic = 'width: ' + buttonWidth + 'px;'
        + 'height:' + buttonHeight+ 'px;';

    startButton.style.cssText += cssBasic;

    startButton.addEventListener('mouseenter', function () {
        startButton.style.cssText += 'width: ' + 2 * buttonWidth + 'px;'
            + 'height:' + 2 * buttonHeight + 'px;';
    });

    startButton.addEventListener('mouseleave', function () {
        startButton.style.cssText += cssBasic;
    });
}

function setStopButtonStyle(button) {
    let cssBasic = 'color: black;'
        + 'font-weight: normal;';

    button.style.cssText +=  cssBasic;

    button.addEventListener('mouseenter', function () {
        let cssHover = 'color: red;'
            + 'font-weight: bold;';
        button.style.cssText += cssHover;
    });

    button.addEventListener('mouseleave', function () {
        button.style.cssText += cssBasic;
    });
}