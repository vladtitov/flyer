/**
 * Created by Администратор on 14.06.2016.
 */
///<reference path="../Gallery4.ts"/>
///<reference path="DragControl.ts"/>
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
        ImageDrag.prototype.setImage = function (model) {
            var _this = this;
            if (this.model)
                this.model.removeDragImage();
            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.model.resetElement();
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.model.renderTransform();
            this.dragControl = new hallmark.DragControl(model.imageClone);
            this.dragControl.start();
            this.dragControl.onPanStart = function () {
                _this.startP = _this.model.getOffset();
            };
            this.dragControl.onPan = function (dx, dy) {
                _this.model.setOffset(_this.startP.x - dx, _this.startP.y - dy);
            };
            this.dragControl.onScaleStart = function () {
                _this.startScale = _this.model.getScale();
            };
            this.dragControl.onScale = function (k) {
                _this.model.setScale(_this.startScale * k);
            };
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map