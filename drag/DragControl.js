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
            this.listeners = {};
            this.reset();
        }
        /* private handleMove(x:number, y:number):void {
             if (this.isGestur){
                 this.stopGestures();
                 return;
             }
             if (!this.isMoving) {
                 this.isMoving = true;
                 this.startX = x;
                 this.startY = y;
                 this.DX = 0;
                 this.DY = 0;
                 this.prevX=x;
                 this.prevY=y;
                 if(this.ind){
                     $('#Move').show();
                     /// $('#Move').fadeOut('fast',()=>{$('#Move').fadeIn()});
                 }
                 if (this.onMoveStart)this.onMoveStart();
 
             } else {
 
                 this.DX = x - this.startX;
                 this.DY = y - this.startY;
                 if(this.ind){
                     this.ind.css({left:this.DX,top:this.DY})
                 }
                 var dx = x - this.prevX;
                 var dy = y - this.prevY;
                 this.moveSpeed=Math.sqrt(dx*dx+dy*dy);
                 this.prevX=x;
                 this.prevY=y;
 
                 if (this.onMove)this.onMove(this.DX, this.DY);
             }
 
 
             //// console.log(this.moveX+'  '+this.moveY);
 
         }*/
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
        DragControl.prototype.onTouchStart = function (evt) {
            var num = evt.touches;
            if (evt.touches.length == 1) {
            }
            //this.stop();
        };
        DragControl.prototype.reset = function () {
            this.centerCurrent = null;
            this.centerStart = null;
            this.distanceStart = 0;
            this.distanceCurrent = 0;
            this.panStart = null;
            this.panCurrent = null;
        };
        /*  private calculateXY():{x:number,y:number}{
              if(this.length==0) return {x: this.touches[0].clientX,y:this.touches[0].clientY};
              else  return {x: this.touches[0].clientX,y:this.touches[0].clientY};
          }*/
        DragControl.prototype.onTouchEnd = function (evt) {
            if (evt.touches.length == 0)
                this.reset();
        };
        DragControl.prototype.on2touches = function () {
        };
        DragControl.prototype.on1touch = function () {
        };
        DragControl.prototype.onLengthChanged = function (num) {
            this.length = num;
            this.reset();
            if (num === 1)
                this.on1touch();
            else
                this.on2touches();
        };
        DragControl.prototype.onPanStart = function () {
        };
        DragControl.prototype.onpanEnd = function () {
        };
        DragControl.prototype.onPan = function (deltaX, deltaY) {
        };
        DragControl.prototype.dispatchPan = function () {
            if (!this.panStart) {
                this.panStart = this.panCurrent;
                this.onPanStart();
            }
            else {
                var dx = this.panStart.x - this.panCurrent.x;
                var dy = this.panStart.y - this.panCurrent.y;
                this.onPan(dx, dy);
            }
        };
        DragControl.prototype.calculateRotate = function () {
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
        DragControl.prototype.calculateOneTouch = function () {
            this.panCurrent = { x: this.touches[0].clientX, y: this.touches[0].clientY };
        };
        DragControl.prototype.onScaleStart = function () {
        };
        DragControl.prototype.onScale = function (num) {
        };
        DragControl.prototype.dispatcheScale = function () {
            if (this.distanceStart === 0) {
                this.distanceStart = this.distanceCurrent;
                this.onScaleStart();
            }
            else {
                this.onScale(this.distanceCurrent / this.distanceStart);
            }
        };
        DragControl.prototype.onCenterStart = function (p) {
        };
        DragControl.prototype.onCenterChange = function (dp) {
        };
        DragControl.prototype.getBoundaries = function () {
            var rec = new Rec();
            rec.x = this.el.offsetLeft;
            rec.y = this.el.offsetTop;
            rec.w = this.el.offsetWidth;
            rec.h = this.el.offsetHeight;
            return rec;
        };
        DragControl.prototype.dispatchCenter = function () {
            if (!this.centerStart) {
                this.centerStart = this.centerCurrent;
                this.onCenterStart(this.centerStart);
            }
            else {
                var dp = {
                    dx: this.centerCurrent.x - this.centerStart.x,
                    dy: this.centerCurrent.y - this.centerStart.y
                };
                this.onCenterChange(dp);
            }
        };
        DragControl.prototype.calculateMotions = function () {
            if (this.length == 2)
                this.calculateTouches();
            else
                this.calculateOneTouch();
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
            if (this.length == 1) {
                this.dispatchPan();
            }
            else {
                this.dispatcheScale();
                this.dispatchCenter();
            }
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