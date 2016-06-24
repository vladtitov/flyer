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
            this.transformType = "transform";
            for (var str in vo)
                this[str] = vo[str];
            var size = ModelImage.thumbSize;
            this.categories = vo.cats.split(",").map(Number);
            //this.name = String(vo)
            this.canvasView = new Container();
            this.canvasView.mouseChildren = false;
            this.canvasView.name = 'canvasView_' + this.id;
            this.resetElement();
            this.loadImage();
            var sh = new Shape();
            sh.name = 'shape';
            /*sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);*/
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
        ModelImage.prototype.resetElement = function () {
            this.transform = { translate: { x: 0, y: 0 },
                scale: 1,
                angle: 0,
                rx: 0,
                ry: 0,
                rz: 0
            };
            return this;
        };
        ModelImage.prototype.removeDragImage = function () {
            var $img = this.$image;
            $img.fadeOut('slow', function () { $img.remove(); });
            return this;
        };
        ModelImage.prototype.appendToDrag = function ($cont) {
            var _this = this;
            this.$image = $(this.image).clone();
            this.imageClone = this.$image.get(0);
            this.$image.on('remove_me', function () { return _this.removeDragImage(); });
            var off = ModelImage.canvacView.offset();
            var p = this.canvasView.localToGlobal(0, 0);
            /*off.left+=p.x;
            off.top+=p.y;*/
            this.transform.translate.x = off.left + p.x;
            this.transform.translate.y = off.top + p.y;
            this.$image.appendTo($cont);
            return this;
        };
        ModelImage.prototype.setOffset = function (x, y) {
            this.transform.translate.x = x;
            this.transform.translate.y = y;
        };
        ModelImage.prototype.getOffset = function () {
            return { x: this.transform.translate.x, y: this.transform.translate.y };
        };
        ModelImage.prototype.renderTransform = function () {
            var value_array = [
                'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
                'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
                'rotate3d(' + this.transform.rx + ',' + this.transform.ry + ',' + this.transform.rz + ',' + this.transform.angle + 'deg)'
            ];
            var value = value_array.join(" ");
            this.imageClone.style.webkitTransform = value;
            //this.image.style.mozTransform = value;
            //this.image.style[this.transformType] = value;
        };
        ModelImage.prototype.setScale = function (scale) {
            this.transform.scale = scale;
        };
        ModelImage.prototype.setAngle = function (angle) {
            this.transform.rz = 1;
            this.transform.angle = angle;
        };
        ModelImage.prototype.getScale = function () {
            return this.transform.scale;
        };
        ModelImage.prototype.getAngle = function () {
            return this.transform.angle;
        };
        ModelImage.prototype.loadImage = function () {
            var _this = this;
            var img = new Image();
            // img.crossOrigin = "anonymous";
            img.src = this.thumb;
            var size = ModelImage.thumbSize;
            img.onload = function (event) {
                var w = img.naturalWidth;
                var h = img.naturalHeight;
                var s = size / w;
                if (w < h)
                    s = size / h;
                var bmp = new createjs.Bitmap(img);
                //   bmp.cache( 0, 0,size, size);
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
            this.image = img;
        };
        ModelImage.trigger = $({});
        ModelImage.IMAGE_LOADED = "IMAGE_LOADED";
        return ModelImage;
    }());
    hallmark.ModelImage = ModelImage;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ModelImage.js.map