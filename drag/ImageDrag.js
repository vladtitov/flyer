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
        ImageDrag.prototype.on1Touch = function () {
            var _this = this;
            this.dragControl.onPanStart = function () {
                _this.startP = _this.model.getOffset();
                console.log(_this.startP);
            };
            this.dragControl.onPan = function (dx, dy) {
                _this.model.setOffset(_this.startP.x - dx, _this.startP.y - dy);
            };
            this.dragControl.onScaleStart = function () { };
            this.dragControl.onScale = function (k) { };
            this.dragControl.onCenterStart = function () { };
            this.dragControl.onCenterChange = function (dp) { };
        };
        ImageDrag.prototype.on2Touches = function () {
            var _this = this;
            this.dragControl.onPanStart = function () {
            };
            this.dragControl.onPan = function (dx, dy) {
            };
            this.dragControl.onScaleStart = function () {
                _this.startScale = _this.model.getScale();
            };
            this.dragControl.onScale = function (k) {
                _this.model.setScale(_this.startScale * k);
            };
            this.dragControl.onCenterStart = function () {
                _this.centerStart = _this.model.getCenter();
                console.log(_this.centerStart);
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
            this.dragControl.on1touch = function () { return _this.on1Touch(); };
            this.dragControl.on2touches = function () { return _this.on2Touches(); };
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map