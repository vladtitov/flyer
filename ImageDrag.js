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
        ImageDrag.prototype.addDrag = function () {
            var _this = this;
            var $img = this.$image;
            if (!$img)
                return;
            $(document).on("touchmove", function (evt) { return _this.onMouseMove(evt); });
            $img.hammer().on("swiperight swipeleft", function (evt) {
                _this.removeDrag();
                console.log(evt.type);
                if (evt.type == "swipeleft")
                    $img.animate({ opacity: 0.1, left: 0 }, 1000);
                if (evt.type == "swiperight")
                    $img.animate({ opacity: 0.1, left: 320 }, 1000);
                $img.hammer().off("swiperight swipeleft");
                setTimeout(function () {
                    $img.remove();
                }, 1500);
            });
        };
        ImageDrag.prototype.removeDrag = function () {
            $(document).off("touchmove");
        };
        ImageDrag.prototype.dragOnCart = function () {
            var $img = this.$image;
            $img.hammer().off("swiperight swipeleft");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        };
        ImageDrag.prototype.reset = function () {
            this.$image = null;
            this.startX = 0;
            this.startY = 0;
            this.mouseStartX = 0;
            this.mouseStartY = 0;
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
                this.removeDrag();
                this.dragOnCart();
            }
        };
        ImageDrag.prototype.setImage = function (img) {
            this.reset();
            var $img = $(img.image).clone();
            this.$overlay.empty();
            this.$overlay.append($img);
            var off = this.$view.offset();
            off.left += img.p.x;
            off.top += img.p.y;
            $img.offset(off);
            this.$image = $img;
            this.addDrag();
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map