"use strict";
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 100;
        this.color = "#".concat(Math.floor(Math.random() * 16777215).toString(16));
        this.element = this.createElement();
        this.addEventListeners();
    }
    // Création de l'élément Div class Rectangle
    Rectangle.prototype.createElement = function () {
        var rect = document.createElement('div');
        rect.classList.add('rectangle');
        rect.style.width = "".concat(this.size, "px");
        rect.style.height = "".concat(this.size, "px");
        rect.style.backgroundColor = this.color;
        rect.style.top = "".concat(this.y - this.size / 2, "px");
        rect.style.left = "".concat(this.x - this.size / 2, "px");
        return rect;
    };
    // Ecouteur d'évènement
    Rectangle.prototype.addEventListeners = function () {
        this.element.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    };
    // Au double clic, l'élément tourne 360deg et disparaît
    Rectangle.prototype.handleDoubleClick = function () {
        var _this = this;
        this.element.style.transition = 'transform 1s';
        this.element.style.transform = 'rotate(360deg)';
        this.element.classList.add('rotating');
        this.element.addEventListener('transitionend', function () {
            _this.element.remove();
        });
    };
    Rectangle.prototype.getArea = function () {
        return this.size * this.size;
    };
    Rectangle.prototype.setColor = function (color) {
        this.element.style.backgroundColor = color;
    };
    return Rectangle;
}());
var RectangleDrawer = /** @class */ (function () {
    function RectangleDrawer(drawingArea, repaintButton) {
        this.drawingArea = drawingArea;
        this.repaintButton = repaintButton;
        this.rectangles = [];
        this.rotatingRects = 0;
        this.addEventListeners();
    }
    RectangleDrawer.prototype.addEventListeners = function () {
        this.drawingArea.addEventListener('click', this.handleClick.bind(this));
        this.repaintButton.addEventListener('click', this.repaintRectangles.bind(this));
    };
    RectangleDrawer.prototype.handleClick = function (event) {
        var _this = this;
        var rect = new Rectangle(event.clientX, event.clientY);
        this.rectangles.push(rect);
        this.drawingArea.appendChild(rect.element);
        rect.element.addEventListener('dblclick', function () {
            _this.rotatingRects++;
            rect.element.addEventListener('transitionend', function () {
                _this.rotatingRects--;
                if (_this.rotatingRects === 0) {
                    _this.removeRotatingRectangles();
                }
            });
        });
    };
    RectangleDrawer.prototype.removeRotatingRectangles = function () {
        var rotatingElems = this.drawingArea.querySelectorAll('.rectangle.rotating');
        rotatingElems.forEach(function (el) { return el.remove(); });
    };
    RectangleDrawer.prototype.repaintRectangles = function () {
        if (this.rectangles.length < 2)
            return;
        var minDiff = Infinity;
        var rect1 = null;
        var rect2 = null;
        for (var i = 0; i < this.rectangles.length; i++) {
            for (var j = i + 1; j < this.rectangles.length; j++) {
                var area1 = this.rectangles[i].getArea();
                var area2 = this.rectangles[j].getArea();
                var diff = Math.abs(area1 - area2);
                if (diff < minDiff) {
                    minDiff = diff;
                    rect1 = this.rectangles[i];
                    rect2 = this.rectangles[j];
                }
            }
        }
        if (rect1 && rect2) {
            var newColor = "#".concat(Math.floor(Math.random() * 16777215).toString(16));
            rect1.setColor(newColor);
            rect2.setColor(newColor);
        }
    };
    return RectangleDrawer;
}());
document.addEventListener('DOMContentLoaded', function () {
    var drawingArea = document.getElementById('drawingArea');
    var repaintButton = document.getElementById('repaintButton');
    new RectangleDrawer(drawingArea, repaintButton);
});
