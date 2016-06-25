/**
 * Created by Vlad on 6/24/2016.
 */
///<reference path="../Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var DragControl = (function () {
        function DragControl(el) {
            this.el = el;
            this.startX = 0;
            this.startY = 0;
            this.zoom = 0;
            this.angle = 0;
            this.DX = 0;
            this.DY = 0;
            this.moveSpeed = 0;
            //  moveSpeed5:number=0;
            //   count5:number;
            //  accum5:number;
            this.centerX = 0;
            this.centerY = 0;
            this.startScale = 0;
            this.listeners = {};
        }
        DragControl.prototype.handleMove = function (x, y) {
            if (this.isGestur) {
                this.stopGestures();
                return;
            }
            if (!this.isMoving) {
                this.isMoving = true;
                this.startX = x;
                this.startY = y;
                this.DX = 0;
                this.DY = 0;
                this.prevX = x;
                this.prevY = y;
                if (this.ind) {
                    $('#Move').show();
                }
                if (this.onMoveStart)
                    this.onMoveStart();
            }
            else {
                this.DX = x - this.startX;
                this.DY = y - this.startY;
                if (this.ind) {
                    this.ind.css({ left: this.DX, top: this.DY });
                }
                var dx = x - this.prevX;
                var dy = y - this.prevY;
                this.moveSpeed = Math.sqrt(dx * dx + dy * dy);
                this.prevX = x;
                this.prevY = y;
                if (this.onMove)
                    this.onMove(this.DX, this.DY);
            }
            //// console.log(this.moveX+'  '+this.moveY);
        };
        DragControl.prototype.stopMoving = function () {
            $('#Move').hide();
            this.isMoving = false;
            if (this.onMoveEnd)
                this.onMoveEnd();
        };
        DragControl.prototype.stopGestures = function () {
            $('#Gestur').hide();
            this.isGestur = false;
            if (this.onGestStop)
                this.onGestStop();
        };
        DragControl.prototype.setCenter = function (x, y) {
            // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX = x;
            this.centerY = y;
            //}
        };
        DragControl.prototype.handleGesture = function (x1, y1, x2, y2) {
            if (this.isMoving) {
                this.stopMoving();
                return;
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var a = Math.atan2(dy, dx) * 57.2957795;
            var ang = (a + 360) % 360; // (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)
            if (!this.isGestur) {
                this.startDist = dist;
                this.startAng = ang;
                this.isGestur = true;
                this.angle = 0;
                this.zoom = 0;
                if (this.ind) {
                    $('#Gestur').show();
                }
                if (this.onGestStart)
                    this.onGestStart();
            }
            else {
                this.zoom = dist - this.startDist;
                this.angle = ang - this.startAng;
                var sc = dist / this.startDist;
                if (this.ind) {
                    this.ind.css('transform', 'scale(' + sc + ') rotate(' + this.angle + 'deg)');
                }
                if (this.onGest)
                    this.onGest(this.zoom, this.angle);
            }
        };
        DragControl.prototype.onTouchStart = function (evt) {
            var num = evt.touches;
            if (evt.touches.length == 1) {
            }
            //this.stop();
        };
        DragControl.prototype.onTouches0 = function () {
            this.startX = 0;
            this.startY = 0;
            this.startScale = 0;
        };
        DragControl.prototype.calculateXY = function () {
            if (this.length == 0)
                return { x: this.touches[0].clientX, y: this.touches[0].clientY };
            else
                return { x: this.touches[0].clientX, y: this.touches[0].clientY };
        };
        DragControl.prototype.onTouchEnd = function (evt) {
            if (evt.touches.length == 0)
                this.onTouches0();
        };
        DragControl.prototype.onLengthChanged = function (num) {
            this.length = num;
            this.startX = 0;
            this.startScale = 0;
        };
        DragControl.prototype.onPanStart = function () {
        };
        DragControl.prototype.onpanEnd = function () {
        };
        DragControl.prototype.onPan = function (deltaX, deltaY) {
        };
        DragControl.prototype.calculatePan = function () {
            var xy = this.calculateXY();
            if (this.startX == 0) {
                this.startX = xy.x;
                this.startY = xy.y;
                this.onPanStart();
            }
            else {
                this.deltaX = this.startX - xy.x;
                this.deltaY = this.startY - xy.y;
                this.onPan(this.deltaX, this.deltaY);
            }
        };
        DragControl.prototype.calculateRotate = function () {
        };
        DragControl.prototype.getDistance = function () {
            var x1 = this.touches[0].clientX;
            var x2 = this.touches[1].clientX;
            var y1 = this.touches[0].clientY;
            var y2 = this.touches[1].clientY;
            var dx = x2 - x1;
            var dy = y2 - y1;
            //  this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            return dist;
        };
        DragControl.prototype.onScaleStart = function () {
        };
        DragControl.prototype.onScale = function (num) {
        };
        DragControl.prototype.calculatePinch = function () {
            var dist = this.getDistance();
            if (this.startScale === 0) {
                this.startScale = dist;
                this.onScaleStart();
            }
            else {
                this.onScale(dist / this.startScale);
            }
        };
        DragControl.prototype.calculateMotions = function () {
            this.calculatePan();
            if (this.length == 2) {
                this.calculateRotate();
                this.calculatePinch();
            }
        };
        DragControl.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            this.touches = evt.touches;
            var length = evt.touches.length;
            //  console.log(length);
            if (length > 1)
                length = 2;
            if (this.length !== length)
                this.onLengthChanged(length);
            this.calculateMotions();
            // if (evt.touches.length == 1)this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
            // else if (evt.touches.length == 2)this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
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
            //  this.el.removeEventListener('touchstart', this.listeners['touchstart']);
        };
        DragControl.prototype.setTimedInterval = function (callback, delay, timeout, onEnd) {
            var id = window.setInterval(callback, delay);
            window.setTimeout(function () {
                window.clearInterval(id);
                onEnd();
            }, timeout);
        };
        return DragControl;
    }());
    hallmark.DragControl = DragControl;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=DragControl.js.map