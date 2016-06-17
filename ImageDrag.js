/**
 * Created by Администратор on 14.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>
;
var hallmark;
(function (hallmark) {
    var ImageDrag = (function () {
        function ImageDrag($view) {
            this.$view = $view;
            this.trigger = $({});
            this.$overlay = $("#overlay");
        }
        ImageDrag.prototype.addSwipes = function () {
            var _this = this;
            var $img = this.$image;
            if (!$img)
                return;
            this.hammer = new Hammer($img.get(0));
            this.hammer.on("swiperight swipeleft", function (evt) {
                _this.hammer.off("swiperight swipeleft");
                var x = $img.offset().left - 100;
                if (evt.type == "swiperight")
                    x += 200;
                $img.animate({ opacity: 0.1, left: x });
                setTimeout(function () {
                    $img.remove();
                }, 1500);
            });
        };
        ImageDrag.prototype.addDrag = function () {
            var _this = this;
            var $img = this.$image;
            if (!$img)
                return;
            this.reset();
            $(document).on("touchmove", function (evt) { return _this.onMouseMove(evt); });
            $(document).on("touchend touchcancel", function (evt) {
                $(document).off("touchmove touchend touchcancel");
                $img.on('touchstart', function (evt) { return _this.addDrag(); });
                _this.addSwipes();
            });
        };
        ImageDrag.prototype.dragOnCart = function () {
            var $img = this.$image;
            this.hammer.off("swiperight swipeleft");
            $(document).off("touchmove touchend touchcancel");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        };
        ImageDrag.prototype.removeListeners = function () {
        };
        ImageDrag.prototype.reset = function () {
            this.startX = 0;
            this.startY = 0;
            this.mouseStartX = 0;
            this.mouseStartY = 0;
        };
        ImageDrag.prototype.clear = function () {
            this.reset();
            if (this.$image) {
                var $im = this.$image;
                $im.animate({ opacity: 0.1 }, 500, function () {
                    $im.remove();
                });
            }
        };
        ImageDrag.prototype.onMouseMove = function (evt) {
            var $img = this.$image;
            if (!$img)
                return;
            var touch = evt.originalEvent.touches[0];
            if (this.mouseStartX == 0) {
                var offset = $img.offset();
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
            $img.offset({ left: this.currentX, top: this.currentY });
            if (this.currentX < 100 && this.currentY > 360) {
                this.dragOnCart();
            }
        };
        ImageDrag.prototype.setImage = function ($img) {
            this.clear();
            this.$overlay.append($img);
            var off = this.$view.offset();
            off.left += $img.data('x');
            off.top += $img.data('y');
            $img.offset(off);
            this.$image = $img;
            this.addDrag();
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map