/**
 * Created by VladHome on 1/29/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
///<reference path="ModelImage.ts"/>
var hallmark;
(function (hallmark) {
    var Bitmap = createjs.Bitmap;
    var CollectionImages = (function () {
        function CollectionImages(options) {
            var _this = this;
            this.options = options;
            this.GOT_50 = 'GOT_50';
            this.trigger = $({});
            //  private images:DisplayObject[] = [];
            this.current = 0;
            hallmark.ModelImage.thumbSize = this.options.thumbSize;
            var count = 0;
            hallmark.ModelImage.trigger.on(hallmark.ModelImage.IMAGE_LOADED, function () {
                if (count++ === 51) {
                    _this.trigger.trigger(_this.GOT_50);
                    hallmark.ModelImage.trigger.off(hallmark.ModelImage.IMAGE_LOADED);
                }
            });
            this.loadData(options.server + options.getimages);
        }
        CollectionImages.prototype.loadData = function (url) {
            var _this = this;
            $.get(url).done(function (res) {
                //this.images.resolve(res);
                console.log(res);
                var out = [];
                for (var i = 0, n = res.length; i < n; i++) {
                    var image = new hallmark.ModelImage(res[i]);
                    out.push(image);
                }
                _this.data = out;
            });
        };
        CollectionImages.prototype.getPrice1 = function () {
            return this.price1.clone();
        };
        CollectionImages.prototype.getPrice2 = function () {
            return this.price2.clone();
        };
        CollectionImages.prototype.createPrices = function () {
            this.price1 = new Bitmap('media/assets/price1.png');
            this.price2 = new Bitmap('media/assets/price2.png');
        };
        /* getImageByReference(DO:DisplayObject):ModelImage{
             if(DO.name=='bmp' || DO.name=='shape'){
                 return this.images[DO.parent.name];
             }
             return null;
         }*/
        /*addImages(num:number, ar:DisplayObject[]):void {
            this.images = this.images.concat(ar);
        }
*/
        CollectionImages.prototype.getNext = function () {
            this.current++;
            if (this.current >= this.data.length)
                this.current = 0;
            // this.data[this.current].name=this.current.toString();
            return this.data[this.current];
        };
        CollectionImages.prototype.getPrev = function () {
            this.current--;
            if (this.current < 0)
                this.current = this.data.length - 1;
            // var cont = new Container();
            return this.data[this.current];
        };
        //static onImageLoaded:Function;
        CollectionImages.trigger = $({});
        return CollectionImages;
    }());
    hallmark.CollectionImages = CollectionImages;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=CollectionImages.js.map