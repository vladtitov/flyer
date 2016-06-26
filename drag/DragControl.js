/**
 * Created by Vlad on 6/24/2016.
 */
///<reference path="../Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var Rec = (function () {
        function Rec() {
        }
        return Rec;
    }());
    var DragControl = (function () {
        function DragControl(el) {
            this.el = el;
            this.listeners = {};
            this.reset();
            this.start();
        }
        DragControl.prototype.reset = function () {
            this.centerCurrent = null;
            this.centerStart = null;
            this.distanceStart = 0;
            this.distanceCurrent = 0;
            this.panStart = null;
            this.panCurrent = null;
        };
        DragControl.prototype.onTouchEnd = function (evt) {
            if (evt.touches.length == 0)
                this.reset();
        };
        DragControl.prototype.onLengthChanged = function (num) {
            this.length = num;
            this.reset();
            if (num === 1 && this.on1touch)
                this.on1touch();
            else if (num === 2 && this.on2touches)
                this.on2touches();
        };
        DragControl.prototype.dispatchPan = function () {
            if (!this.panStart) {
                this.panStart = this.panCurrent;
                if (this.onPanStart)
                    this.onPanStart();
            }
            else if (this.onPan) {
                var dx = this.panStart.x - this.panCurrent.x;
                var dy = this.panStart.y - this.panCurrent.y;
                this.onPan(dx, dy);
            }
        };
        DragControl.prototype.calculateTouches = function () {
            var x1 = this.touches[0].clientX;
            var x2 = this.touches[1].clientX;
            var y1 = this.touches[0].clientY;
            var y2 = this.touches[1].clientY;
            var dx = x2 - x1;
            var dy = y2 - y1;
            var a = Math.atan2(dy, dx) * 57.2957795;
            this.angleCurrent = (a + 360) % 360;
            this.distanceCurrent = Math.sqrt(dx * dx + dy * dy);
            this.centerCurrent = { x: (x2 + x1) / 2, y: (y1 + y2) / 2 };
        };
        DragControl.prototype.calculatePan = function () {
            this.panCurrent = { x: this.touches[0].clientX, y: this.touches[0].clientY };
        };
        DragControl.prototype.dispatcheScale = function () {
            if (this.distanceStart === 0) {
                this.distanceStart = this.distanceCurrent;
                if (this.onScaleStart)
                    this.onScaleStart();
            }
            else if (this.onScale) {
                this.onScale(this.distanceCurrent / this.distanceStart);
            }
        };
        DragControl.prototype.dispatchCenter = function () {
            if (!this.centerStart) {
                this.centerStart = this.centerCurrent;
                if (this.onCenterStart)
                    this.onCenterStart(this.centerStart);
            }
            else if (this.onCenterChange) {
                var dp = {
                    dx: this.centerCurrent.x - this.centerStart.x,
                    dy: this.centerCurrent.y - this.centerStart.y
                };
                this.onCenterChange(dp);
            }
        };
        DragControl.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            this.touches = evt.touches;
            var length = evt.touches.length;
            if (length == 0)
                return;
            if (length > 1)
                length = 2;
            if (this.length !== length)
                this.onLengthChanged(length);
            if (this.length == 1) {
                this.calculatePan();
                this.dispatchPan();
            }
            else {
                this.calculateTouches();
                this.dispatcheScale();
                this.dispatchCenter();
            }
        };
        DragControl.prototype.destroy = function () {
            this.stop();
            this.el = null;
        };
        DragControl.prototype.start = function () {
            var _this = this;
            /*  var onTouchStart = (evt:TouchEvent)=>this.onTouchStart(evt);
              this.el.addEventListener('touchstart',onTouchStart);
              this.listeners['touchstart'] = onTouchStart;
              var onTouchEnd = (evt:TouchEvent)=>this.onTouchEnd(evt);
              this.listeners['touchend'] = onTouchEnd;*/
            var onTouchEnd = function (evt) { return _this.onTouchEnd(evt); };
            this.el.addEventListener('touchend', onTouchEnd);
            this.listeners['touchend'] = onTouchEnd;
            var onTouchMove = function (evt) { return _this.onTouchMove(evt); };
            this.listeners['touchmove'] = onTouchMove;
            this.el.addEventListener('touchmove', onTouchMove);
        };
        DragControl.prototype.stop = function () {
            this.el.removeEventListener('touchmove', this.listeners['touchmove']);
            this.el.removeEventListener('touchend', this.listeners['touchend']);
        };
        return DragControl;
    }());
    hallmark.DragControl = DragControl;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=DragControl.js.map