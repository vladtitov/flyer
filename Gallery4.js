//import {ImagesLoader} from "./ImagesLoader";
/**
 * Created by VladHome on 1/8/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="ImagesRow.ts"/>
///<reference path="ImagesLibrary.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var ImagesRowOpt = (function () {
        function ImagesRowOpt() {
        }
        return ImagesRowOpt;
    }());
    hallmark.ImagesRowOpt = ImagesRowOpt;
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
                console.log('click');
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
            var bmp = this.imageView.setImage(this.view, source.vo.image, pt.x, pt.y, this.options.thumbSize, this.options.thumbSize, this.options.previwWidth, this.options.previwHeight, this.options.prviewPaddingX, this.options.prviewPaddingY);
        };
        return ImagePreview;
    }());
    hallmark.ImagePreview = ImagePreview;
    var Gallery4 = (function () {
        function Gallery4($view, data, options) {
            var _this = this;
            var canv = document.createElement('canvas');
            canv.width = options.canvasWidth;
            canv.height = options.canvasHeight;
            $view.append(canv);
            this.stage = new createjs.Stage(canv);
            this.data = data;
            this.imagesLibrary = new hallmark.ImagesLibrary(data, options);
            var count = 0;
            hallmark.ImagesLibrary.onImageLoaded = function () {
                count++;
                //console.log(count);
                if (count > 50) {
                    hallmark.ImagesLibrary.onImageLoaded = null;
                    _this.createRows(options);
                }
            };
            hallmark.ImagesRow.onImageClick = function (DO) {
                var img = _this.imagesLibrary.getImageByReference(DO);
                if (img)
                    _this.preview.showImage(DO, img);
                _this.stage.addChild(_this.preview.view);
            };
            this.preview = new ImagePreview(options);
            // this.isWebGL = this.stage.isWebGL
            createjs.Touch.enable(this.stage);
            createjs.Ticker.framerate = 60;
            var stage = this.stage;
            var stamp = Date.now();
            var count = 0;
            createjs.Ticker.addEventListener("tick", function (num) {
                stage.update();
                //count++;
                // if(count>100){
                //  var d= (Date.now()-stamp);
                //   stamp=Date.now();
                // console.log(100/(d/1000));
                //   count=0;
                //}
            });
        }
        Gallery4.prototype.createRows = function (options) {
            for (var i = 0, n = options.rows; i < n; i++) {
                var row = new hallmark.ImagesRow(this.imagesLibrary, options, i);
                row.setPosition(0, i * options.rowHeight);
                row.createBackground('#999999');
                this.stage.addChild(row.view);
            }
        };
        return Gallery4;
    }());
    hallmark.Gallery4 = Gallery4;
    var App = (function () {
        function App($view, opt) {
            this.images = $.Deferred();
            this.loadData(opt.getimages);
            this.init($view, opt);
            // require(['easel','tween'],()=>{
            //  require(['js/videopuzzle/ImageHolder','js/videopuzzle/Camera','js/videopuzzle/Puzzles','js/videopuzzle/myPuzzle'], ()=> {
            //  this.init($view);
            // });
            // });
        }
        App.prototype.init = function ($view, options) {
            //  console.log($view);
            var _this = this;
            this.images.then(function (data) {
                _this.gallery = new hallmark.Gallery4($view, data, options);
                if (_this.gallery.isWebGL) {
                    $('body').css('background', '#00FF00');
                }
                else {
                }
            });
        };
        App.prototype.loadData = function (url) {
            var _this = this;
            $.get(url).done(function (res) {
                //  console.log(res);
                _this.images.resolve(res);
            });
        };
        return App;
    }());
    hallmark.App = App;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=Gallery4.js.map