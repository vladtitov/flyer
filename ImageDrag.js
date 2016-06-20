/**
 * Created by Администратор on 14.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>
///<reference path="ModelImage.ts"/>
///<reference path="ShopingCart.ts"/>
var hallmark;
(function (hallmark) {
    var ImageDrag = (function () {
        function ImageDrag() {
            this.trigger = $({});
            this.$overlay = $("#overlay");
        }
        ImageDrag.prototype.addSwipes = function () {
            var _this = this;
            if (!this.model)
                return;
            var $img = this.model.$image;
            this.hammer = new Hammer($img.get(0));
            this.hammer.on("swiperight swipeleft", function (evt) {
                _this.hammer.off("swiperight swipeleft");
                _this.hammer.off("pinch rotate");
                _this.model.setScale(1);
                var x = $img.offset().left - 100;
                if (evt.type == "swiperight")
                    x += 200;
                $img.animate({ left: x });
                _this.model.removeDragImage();
                _this.reset();
                _this.shopingCart.toggleView();
            });
        };
        ImageDrag.prototype.addScaleRotate = function () {
            var _this = this;
            if (!this.model)
                return;
            var $img = this.model.$image;
            this.hammer = new Hammer($img.get(0));
            var pinch = new Hammer.Pinch();
            var rotate = new Hammer.Rotate();
            pinch.recognizeWith(rotate);
            this.hammer.add([pinch, rotate]);
            this.hammer.on("pinch rotate", function (evt) {
                var curScale = _this.model.getScale();
                var scale = Math.max(1, Math.min(curScale * evt.scale, 3));
                _this.model.setScale(scale);
                var curRotation = _this.model.getRotation();
                var rotation = curRotation + evt.rotation;
                _this.model.setRotation(rotation);
            });
        };
        ImageDrag.prototype.addDrag = function () {
            var _this = this;
            if (!this.model)
                return;
            this.resetXY();
            var $img = this.model.$image;
            $(document).on("touchmove", function (evt) { return _this.onMouseMove(evt); });
            this.addScaleRotate();
            $(document).on("touchend touchcancel", function (evt) {
                $(document).off("touchmove touchend touchcancel");
                $img.on('touchstart', function (evt) { return _this.addDrag(); });
                _this.addSwipes();
            });
        };
        /*dragOnCart () {
            var $img = this.model.$image;
            this.hammer.off("swiperight swipeleft");
            $(document).off("touchmove touchend touchcancel");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        }*/
        ImageDrag.prototype.removeDrag = function () {
            $(document).off("touchmove");
        };
        ImageDrag.prototype.resetXY = function () {
            this.startX = 0;
            this.startY = 0;
            this.mouseStartX = 0;
            this.mouseStartY = 0;
        };
        ImageDrag.prototype.reset = function () {
            this.model = null;
            this.resetXY();
            if (this.hammer) {
                this.hammer.off("swiperight swipeleft");
            }
            $(document).off("touchmove touchend touchcancel");
        };
        ImageDrag.prototype.onMouseMove = function (evt) {
            if (!this.model)
                return;
            var $img = this.model.$image;
            var touch = evt.originalEvent.touches[0];
            if (this.mouseStartX == 0) {
                var offset = this.model.getOffset();
                this.startX = offset.left;
                this.startY = offset.top;
                this.mouseStartX = touch.clientX;
                this.mouseStartY = touch.clientY;
                return;
            }
            var dX = touch.clientX - this.mouseStartX;
            var dY = touch.clientY - this.mouseStartY;
            this.currentX = this.startX + dX;
            this.currentY = this.startY + dY;
            this.model.setOffset({ left: this.currentX, top: this.currentY });
            // $img.offset();
            //if (this.currentX < this.cartX && this.currentY > this.cartY) this.trigger.triggerHandler('ON_CART');
        };
        ImageDrag.prototype.setImage = function (model) {
            if (this.model)
                this.model.removeDragImage();
            this.reset();
            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.addDrag();
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map