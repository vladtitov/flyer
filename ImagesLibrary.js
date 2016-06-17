var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by VladHome on 1/29/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var Bitmap = createjs.Bitmap;
    var Container = createjs.Container;
    var Shape = createjs.Shape;
    var ImageModel = (function () {
        function ImageModel() {
        }
        return ImageModel;
    }());
    hallmark.ImageModel = ImageModel;
    var ImageHolder = (function (_super) {
        __extends(ImageHolder, _super);
        function ImageHolder(vo, size) {
            var _this = this;
            _super.call(this);
            this.vo = vo;
            for (var str in vo)
                this[str] = vo[str];
            this.categories = vo.cats.split(",").map(Number);
            //this.name = String(vo)
            var img = new Image();
            img.src = vo.thumb;
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
                _this.addChild(bmp);
                //  var cont:Container = new Container()
                //  cont.addChild(vo.sale?ImagesLibrary.instance.getPrice2():ImagesLibrary.instance.getPrice1());
                //  var txt:createjs.Text = new createjs.Text(vo.price, "30px Arial",'#FFFFFF');
                // txt.x = 10;
                // txt.y = 20;
                // cont.addChild(txt);
                // this.addChild(cont);
                _this.cache(0, 0, size, size);
                ImagesLibrary.trigger.triggerHandler("IMAGE_LOADED");
            };
            // var cont:Container = new Container();
            var sh = new Shape();
            sh.name = 'shape';
            sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);
            this.addChild(sh);
        }
        return ImageHolder;
    }(Container));
    hallmark.ImageHolder = ImageHolder;
    /*export class VOImage{
        name:string;
        id:number;
        thumb:string;
        image:string;
        price:string;
        sale:boolean;
        cats:number[];
        constructor(obj,i:number){
            this.id=i;
            for(var str in obj)this[str] = obj[str];
            this.cats=obj.cats.split(',').map(Number);
        }

    }*/
    var ImagesLibrary = (function () {
        function ImagesLibrary(options) {
            this.options = options;
            this.images = [];
            this.current = 0;
            //    ImagesLibrary.instance =  this;
            //    this.createPrices();
            this.loadData(options.url);
        }
        ImagesLibrary.prototype.loadData = function (url) {
            var _this = this;
            $.get(url).done(function (res) {
                //this.images.resolve(res);
                var out = [];
                var size = _this.options.thumbSize;
                for (var i = 0, n = res.length; i < n; i++) {
                    var image = new ImageHolder(res[i], size);
                    image.name = i + "";
                    out.push(image);
                }
                //this.data = out;
                _this.images = out;
            });
        };
        ImagesLibrary.prototype.getPrice1 = function () {
            return this.price1.clone();
        };
        ImagesLibrary.prototype.getPrice2 = function () {
            return this.price2.clone();
        };
        ImagesLibrary.prototype.createPrices = function () {
            this.price1 = new Bitmap('media/assets/price1.png');
            this.price2 = new Bitmap('media/assets/price2.png');
        };
        ImagesLibrary.prototype.getImageByReference = function (DO) {
            if (DO.name == 'bmp' || DO.name == 'shape') {
                return this.images[DO.parent.name];
            }
            return null;
        };
        ImagesLibrary.prototype.addImages = function (num, ar) {
            this.images = this.images.concat(ar);
        };
        ImagesLibrary.prototype.getNext = function () {
            this.current++;
            if (this.current >= this.images.length)
                this.current = 0;
            this.images[this.current].name = this.current.toString();
            return this.images[this.current].clone(true);
        };
        ImagesLibrary.prototype.getPrev = function () {
            this.current--;
            if (this.current < 0)
                this.current = this.images.length - 1;
            // var cont = new Container();
            return this.images[this.current].clone(true);
        };
        ImagesLibrary.prototype.setImageSize = function (num) {
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                console.log(ar[i].getBounds());
            }
        };
        ImagesLibrary.prototype.loadThumbs = function (ar) {
            var out = [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                out.push(new ImageHolder(ar[i], this.options.thumbSize));
            }
            return out;
        };
        //static onImageLoaded:Function;
        ImagesLibrary.trigger = $({});
        return ImagesLibrary;
    }());
    hallmark.ImagesLibrary = ImagesLibrary;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImagesLibrary.js.map