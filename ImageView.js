/**
 * Created by Администратор on 10.06.2016.
 */
//import {ImagesLoader} from "./ImagesLoader";
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="ImagesColumn.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var ImageView = (function () {
        function ImageView() {
        }
        ImageView.prototype.setImage = function (cont, url, x, y, fromW, fromH, toW, toH, paddingX, paddingY) {
            var _this = this;
            var img = new Image();
            img.src = url;
            var bmp = new createjs.Bitmap(img);
            bmp.x = x;
            bmp.y = y;
            img.onload = function (event) {
                var w = img.naturalWidth;
                var h = img.naturalHeight;
                var scaleX = fromW / w;
                var scaleY = fromH / h;
                var scale = scaleX;
                if (scaleX > scaleY)
                    scale = scaleY;
                bmp.scaleX = scale;
                bmp.scaleY = scale;
                bmp.x += (fromW - (w * scale)) / 2;
                bmp.y += (fromH - (h * scale)) / 2;
                scaleX = toW / w;
                scaleY = toH / h;
                scale = (scaleX > scaleY) ? scaleY : scaleX;
                x = (toW - (w * scale)) / 2;
                y = (toH - (h * scale)) / 2;
                if (_this.onImageReady)
                    _this.onImageReady();
                createjs.Tween.get(bmp).to({ scaleX: scale, scaleY: scale, x: x + paddingX, y: y + paddingY }, 500, createjs.Ease.quadIn).call(function () { return _this.onZoomInComplete(); });
                cont.addChild(bmp);
            };
            return bmp;
        };
        ImageView.prototype.onZoomInComplete = function () {
        };
        ImageView.prototype.zoomImage = function () {
        };
        return ImageView;
    }());
    hallmark.ImageView = ImageView;
    var ImagePreview = (function () {
        function ImagePreview(options) {
            var _this = this;
            this.options = options;
            this.view = new Container();
            this.view.addEventListener('click', function () {
                _this.removeMe();
                if (_this.onClick)
                    _this.onClick();
            });
            var self = this;
            this.ticker = function () {
                self.tick();
            };
            this.imageView = new ImageView();
            this.imageView.onImageReady = function () {
            };
        }
        ImagePreview.prototype.start = function () {
            this.num = 0;
            createjs.Ticker.addEventListener("tick", this.ticker);
        };
        ImagePreview.prototype.stop = function () {
            var ticker = this.ticker;
            createjs.Ticker.removeEventListener("tick", this.ticker);
        };
        ImagePreview.prototype.tick = function () {
            this.num++;
            // console.log(this.num);
            // console.log('tick');
        };
        ImagePreview.prototype.removeMe = function () {
            this.num = 0;
            this.stop();
            this.view.parent.removeChild(this.view);
        };
        ImagePreview.prototype.showImage = function (DO, source) {
            this.start();
            this.view.removeAllChildren();
            DO = DO.parent;
            var pt = DO.localToGlobal(0, 0);
            var bmp = this.imageView.setImage(this.view, source.large, pt.x, pt.y, this.options.thumbSize, this.options.thumbSize, this.options.previewWidth, this.options.previewHeight, this.options.prviewPaddingX, this.options.prviewPaddingY);
        };
        return ImagePreview;
    }());
    hallmark.ImagePreview = ImagePreview;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageView.js.map