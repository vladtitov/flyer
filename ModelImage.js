/**
 * Created by Vlad on 6/18/2016.
 */
///<reference path="CollectionImages.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var Shape = createjs.Shape;
    var ModelImage = (function () {
        function ModelImage(vo) {
            this.vo = vo;
            for (var str in vo)
                this[str] = vo[str];
            var size = ModelImage.thumbSize;
            this.categories = vo.cats.split(",").map(Number);
            //this.name = String(vo)
            this.canvasView = new Container();
            this.loadImage();
            var sh = new Shape();
            sh.name = 'shape';
            sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);
            this.canvasView.addChild(sh);
        }
        ModelImage.prototype.setX = function (x) {
            this.canvasView.x = x;
            return this;
        };
        ModelImage.prototype.setY = function (y) {
            this.canvasView.y = y;
            return this;
        };
        ModelImage.prototype.removeFrom = function (cont) {
            cont.removeChild(this.canvasView);
            return this;
        };
        ModelImage.prototype.appendTo = function (cont) {
            cont.addChild(this.canvasView);
            return this;
        };
        ModelImage.prototype.loadImage = function () {
            var _this = this;
            var img = new Image();
            img.src = this.thumb;
            var size = ModelImage.thumbSize;
            img.onload = function (event) {
                var w = img.naturalWidth;
                var h = img.naturalHeight;
                var s = size / w;
                if (w < h)
                    s = size / h;
                var bmp = new createjs.Bitmap(img);
                bmp.name = 'bmp';
                bmp.scaleX = s;
                bmp.scaleY = s;
                w = w * s;
                h = h * s;
                bmp.x = (size - w) / 2;
                bmp.y = (size - h) / 2;
                _this.canvasView.addChild(bmp);
                _this.canvasView.cache(0, 0, size, size);
                ModelImage.trigger.triggerHandler(ModelImage.IMAGE_LOADED);
            };
        };
        ModelImage.trigger = $({});
        ModelImage.IMAGE_LOADED = "IMAGE_LOADED";
        return ModelImage;
    }());
    hallmark.ModelImage = ModelImage;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ModelImage.js.map