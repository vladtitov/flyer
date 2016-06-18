/**
 * Created by VladHome on 1/8/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="ImagesColumn.ts"/>
///<reference path="ImagesLibrary.ts"/>
///<reference path="ImageView.ts"/>
///<reference path="ImageDrag.ts"/>
///<reference path="ShopingCart.ts"/>
var hallmark;
(function (hallmark) {
    var ImagesRowOpt = (function () {
        function ImagesRowOpt() {
        }
        return ImagesRowOpt;
    }());
    hallmark.ImagesRowOpt = ImagesRowOpt;
    var Gallery4 = (function () {
        function Gallery4($view, options) {
            var _this = this;
            this.$view = $view;
            this.drag = new hallmark.ImageDrag($view);
            this.shopingCart = new hallmark.ShopingCart;
            this.drag.trigger.on("DRAG_ON_CART", function (evt, img) { return _this.shopingCart.addItem(img); });
            var canv = document.createElement('canvas');
            canv.width = options.canvasWidth;
            canv.height = options.canvasHeight;
            $view.append(canv);
            this.stage = new createjs.Stage(canv);
            //this.data = data;
            this.imagesLibrary = new hallmark.ImagesLibrary(options);
            var count = 0;
            hallmark.ImagesLibrary.trigger.on("IMAGE_LOADED", function () {
                if (count++ > 50) {
                    hallmark.ImagesLibrary.trigger.off("IMAGE_LOADED");
                    _this.createColumn(options);
                }
                ;
            });
            /* ImagesColumn.onImageClick = (DO:DisplayObject)=>{
                 var img:ImageHolder =  this.imagesLibrary.getImageByReference(DO);
                 if(img) this.preview.showImage(DO,img);
                 this.stage.addChild(this.preview.view);
             }*/
            this.preview = new hallmark.ImagePreview(options);
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
        /*element = document.getElementById('spin');

        element.addEventListener('click', (evt:MouseEvent)=> {
            move (20);
        });*/
        Gallery4.prototype.createColumn = function (options) {
            var _this = this;
            //createjs.EventDispatcher.initialize(ImagesColumn.prototype);
            for (var i = 0; i < 3; i++) {
                var column = new hallmark.ImagesColumn(this.imagesLibrary, options, i);
                column.setPosition(i * 100 + 5, 10);
                //column.createBackground('#3c763d');
                this.stage.addChild(column.view);
                column.addEventListener('IMAGE_SELECTED', function (evt) { return _this.onImageSelected(evt); });
            }
        };
        Gallery4.prototype.onImageSelected = function (evt) {
            this.drag.setImage(evt.data);
        };
        return Gallery4;
    }());
    hallmark.Gallery4 = Gallery4;
    var App = (function () {
        function App($view, opt) {
            this.gallery = new hallmark.Gallery4($view, opt);
        }
        return App;
    }());
    hallmark.App = App;
})(hallmark || (hallmark = {}));
$(document).ready(function () {
    console.log($(window).width() + 'x' + $(window).height());
    var width = $(window).width();
    var height = $(window).height() - 230;
    $('#shopcart').click(function () {
        $('#shopcartitems').toggle();
        $('#spin').toggle();
    });
    var options = {
        canvasWidth: width,
        canvasHeight: height,
        url: 'getimages.php',
        thumbSize: 100,
        thumbDistance: 110,
        rowHeight: height,
        rowWidth: 105,
        // rows:5,
        //  cols:4,
        rows: 7,
        cols: 5,
        prviewPaddingX: 10,
        prviewPaddingY: 10,
        previewWidth: width - 20,
        previewHeight: height - 20
    };
    var gal = new hallmark.App($('#mainview'), options);
});
//# sourceMappingURL=Gallery4.js.map