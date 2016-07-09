/**
 * Created by Vlad on 6/25/2016.
 */
///<reference path="../Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var ImageTransform = (function () {
        function ImageTransform(url) {
            var _this = this;
            this.centerCurrent = { x: 50, y: 50 };
            this.transformType = "transform";
            this.width = 100;
            this.height = 100;
            this.$image = $('<img>').attr('src', url);
            this.image = this.$image.get(0);
            this.$image.on('remove_me', function () { return _this.removeDragImage(); });
            this.resetElement();
        }
        ImageTransform.prototype.createDragControl = function () {
            var _this = this;
            this.dragControl = new hallmark.DragControl(this.image);
            this.dragControl.on1touch = function () { return _this.on1Touch(); };
            this.dragControl.on2touches = function () { return _this.on2Touches(); };
        };
        ImageTransform.prototype.on1Touch = function () {
            var _this = this;
            this.dragControl.onPanStart = function () {
                _this.startP = _this.getOffset();
            };
            this.dragControl.onPan = function (dx, dy) {
                _this.setOffset(_this.startP.x - dx, _this.startP.y - dy);
                //this.folleowRectangle();;
            };
            this.dragControl.onScaleStart = null;
            this.dragControl.onScale = null;
            this.dragControl.onCenterStart = null;
            this.dragControl.onCenterChange = null;
        };
        ImageTransform.prototype.on2Touches = function () {
            var _this = this;
            this.dragControl.onPanStart = null;
            this.dragControl.onPan = null;
            this.dragControl.onScaleStart = function () {
                _this.startScale = _this.getScale();
            };
            this.dragControl.onScale = function (k) {
                _this.setScale(_this.startScale * k);
                // this.folleowRectangle();
            };
            this.dragControl.onCenterStart = function (p) {
                _this.centerStart = _this.getCenter();
                var m = _this.toGlobal();
                var x = (p.x - m.x) / m.scale;
                var y = (p.y - m.y) / m.scale;
                _this.setCenter(x, y);
            };
            this.dragControl.onCenterChange = function (dp) {
                /*  if(this.centerStart){
                 var p:{x:number;y:number} = {
                 x:this.centerStart.x - dp.dx,
                 y:this.centerStart.y - dp.dy
                 }
                 this.model.setCenter(p);
                 this.centerStart = null;
                 }
                 */
            };
        };
        //////////////////////////////////////////////////////////////
        ImageTransform.prototype.setScale = function (scale) {
            this.transform.scale = scale;
            this.requestElementUpdate();
        };
        ImageTransform.prototype.setAngle = function (angle) {
            this.transform.angle = angle;
            this.requestElementUpdate();
        };
        ImageTransform.prototype.getScale = function () {
            return this.transform.scale;
        };
        ImageTransform.prototype.getAngle = function () {
            return this.transform.angle;
        };
        ImageTransform.prototype.getCenter = function () {
            return this.centerCurrent;
        };
        ImageTransform.prototype.setCenter = function (x, y) {
            var dx = x - this.centerCurrent.x;
            var dy = y - this.centerCurrent.y;
            this.transform.translate.x += (dx * this.transform.scale) - dx;
            this.transform.translate.y += (dy * this.transform.scale) - dy;
            this.centerCurrent.x = x;
            this.centerCurrent.y = y;
            this.isCenter = true;
            this.requestElementUpdate();
        };
        ImageTransform.prototype.setOffset = function (x, y) {
            this.transform.translate.x = x;
            this.transform.translate.y = y;
            this.requestElementUpdate();
        };
        ImageTransform.prototype.getOffset = function () {
            return { x: this.transform.translate.x, y: this.transform.translate.y };
        };
        ImageTransform.prototype.toGlobal = function () {
            //m.x-(m.center.x*m.scale)+m.center.x
            return {
                x: this.transform.translate.x - (this.centerCurrent.x * this.transform.scale) + this.centerCurrent.x,
                y: this.transform.translate.y - (this.centerCurrent.y * this.transform.scale) + this.centerCurrent.y,
                w: this.width * this.transform.scale,
                h: this.height * this.transform.scale,
                scale: this.transform.scale,
                center: this.centerCurrent
            };
        };
        ImageTransform.prototype.resetElement = function () {
            this.transform = { translate: { x: 0, y: 0 },
                scale: 1,
                angle: 0,
                rx: 0,
                ry: 0,
                rz: 0
            };
            return this;
        };
        ImageTransform.prototype.requestElementUpdate = function () {
            var _this = this;
            if (!this.ticking) {
                this.reqAnimationFrame(function () { return _this.updateElementTransform(); });
                this.ticking = true;
            }
        };
        ImageTransform.prototype.updateElementTransform = function () {
            this.ticking = false;
            this.renderTransform();
        };
        ImageTransform.prototype.reqAnimationFrame = function (callBack) {
            /*return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
             window.setTimeout(callback, 1000 / 60);
             };*/
            requestAnimationFrame(function () { return callBack(); });
        };
        ;
        ImageTransform.prototype.renderTransform = function () {
            if (this.isCenter) {
                this.image.style.transformOrigin = this.centerCurrent.x + 'px ' + this.centerCurrent.y + 'px';
                this.isCenter = false;
            }
            var value_array = [
                'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
                'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
                'rotate3d(' + this.transform.rx + ',' + this.transform.ry + ',' + this.transform.rz + ',' + this.transform.angle + 'deg)'
            ];
            var value = value_array.join(" ");
            this.image.style.webkitTransform = value;
            //this.image.style.mozTransform = value;
            //this.image.style[this.transformType] = value;
        };
        ImageTransform.prototype.destroy = function () {
        };
        ImageTransform.prototype.appendTo = function ($cont) {
            this.$image.appendTo($cont);
        };
        ImageTransform.prototype.removeDragImage = function () {
            var $img = this.$image;
            $img.fadeOut('slow', function () { $img.remove(); });
            this.destroy();
        };
        return ImageTransform;
    }());
    hallmark.ImageTransform = ImageTransform;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=MyImage.js.map