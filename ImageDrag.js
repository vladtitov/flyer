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
            this.ticking = false;
            this.trigger = $({});
            this.$overlay = $("#overlay");
        }
        ImageDrag.prototype.reqAnimationFrame = function (callBack) {
            /*return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };*/
            requestAnimationFrame(function () { return callBack(); });
        };
        ;
        ImageDrag.prototype.hammerStart = function () {
            var _this = this;
            if (this.model) {
                this.img = this.model.imageClone;
                this.$image = this.model.$image;
            }
            else
                return;
            this.mc = new Hammer.Manager(this.img);
            this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
            this.mc.add(new Hammer.Swipe()).recognizeWith(this.mc.get('pan'));
            this.mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(this.mc.get('pan'));
            this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(this.mc.get('pan'));
            this.mc.on("panmove", function (evt) { return _this.onPan(evt); });
            this.mc.on("panstart", function (evt) { return _this.onPanStart(evt); });
            this.mc.on("panend", function (evt) { return _this.onPanEnd(evt); });
            this.mc.on("pinchstart pinchmove", function (evt) { return _this.onPinch(evt); });
            //this.mc.on("rotatestart rotatemove", (evt) => this.onRotate (evt));
            //this.mc.on("pinchend rotatenend", (evt) => this.onPinchRotate(evt));
            this.mc.on("hammer.input", function (ev) {
                if (ev.isFinal) {
                }
            });
        };
        ImageDrag.prototype.hammerEnd = function () {
            this.mc.destroy();
            this.mc = null;
        };
        ImageDrag.prototype.updateElementTransform = function () {
            this.ticking = false;
            this.model.renderTransform();
        };
        ImageDrag.prototype.requestElementUpdate = function () {
            var _this = this;
            if (!this.ticking) {
                this.reqAnimationFrame(function () { return _this.updateElementTransform(); });
                this.ticking = true;
            }
        };
        ImageDrag.prototype.onPanStart = function (ev) {
            var offset = this.model.getOffset();
            this.startX = offset.x;
            this.startY = offset.y;
            this.removeSwipes();
        };
        ImageDrag.prototype.onPan = function (ev) {
            this.currentX = this.startX + ev.deltaX;
            this.currentY = this.startY + ev.deltaY;
            this.model.setOffset(this.currentX, this.currentY);
            if (this.currentX < this.cartX && this.currentY > this.cartY)
                this.trigger.triggerHandler('ON_CART');
            else
                this.requestElementUpdate();
        };
        ImageDrag.prototype.onPanEnd = function (ev) {
            this.addSwipes();
        };
        ImageDrag.prototype.onPinch = function (ev) {
            //this.mc.off("rotatestart rotatemove");
            var scale = Math.max(1, Math.min((this.model.getScale() * ev.scale), 3));
            console.log(scale);
            this.model.setScale(scale);
            this.requestElementUpdate();
        };
        ImageDrag.prototype.onRotate = function (ev) {
            //this.mc.off("pinchstart pinchmove");
            console.log(this.model.getAngle() + ev.rotation);
            this.model.setAngle(this.model.getAngle() + ev.rotation);
            this.requestElementUpdate();
        };
        /*onPinchRotate(ev:HammerInput):void {
            this.mc.on("rotatestart rotatemove");
            this.mc.on("pinchstart pinchmove");
        }*/
        ImageDrag.prototype.onSwipeRightLeft = function (ev) {
            var x = this.$image.offset().left - 100;
            if (ev.type == "swiperight")
                x += 200;
            this.$image.animate({ left: x });
            this.model.removeDragImage();
            this.reset();
            this.trigger.triggerHandler("ON_TOGGLE");
        };
        ImageDrag.prototype.addSwipes = function () {
            var _this = this;
            this.mc.on("swiperight swipeleft", function (evt) { return _this.onSwipeRightLeft(evt); });
        };
        ImageDrag.prototype.removeSwipes = function () {
            this.mc.off("swiperight swipeleft");
        };
        ImageDrag.prototype.dragOnCart = function () {
            this.trigger.triggerHandler("DRAG_ON_CART", this.model);
            this.trigger.triggerHandler("ON_TOGGLE");
            this.reset();
        };
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
            if (this.mc) {
                this.hammerEnd();
            }
            $(document).off("touchmove touchend touchcancel");
        };
        ImageDrag.prototype.setImage = function (model) {
            if (this.model)
                this.model.removeDragImage();
            this.reset();
            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.model.resetElement();
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.model.renderTransform();
            this.hammerStart();
            this.addSwipes();
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map