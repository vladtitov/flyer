/**
 * Created by VladHome on 1/28/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
///<reference path="ImagesLibrary.ts"/>
///<reference path="TouchControler.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var EventDispatcher = createjs.EventDispatcher;
    var ImagesColumn = (function (_super) {
        __extends(ImagesColumn, _super);
        function ImagesColumn(lib, opt, id) {
            var _this = this;
            _super.call(this);
            this.lib = lib;
            this.opt = opt;
            this.id = id;
            this.images = [];
            //view.setBounds(0,0,options.rowWidth,options.rowHeight);
            this.dist = opt.thumbDistance;
            var cont = new Container();
            cont.name = 'column_' + id;
            this.touchControler = new hallmark.TouchControler(cont);
            this.touchControler.trigger.on(hallmark.TouchControler.PRESS_HOLD, function (evt, data) { return _this.onPressHold(data); });
            this.touchControler.move = function (evt) { return _this.move(evt); };
            this.view = cont;
            this.first = 0;
            this.addImages(opt);
            var prev = 0;
            var pressStart;
            var self = this;
            var count = 0;
            var stamp = Date.now();
            createjs.Ticker.addEventListener("tick", function () {
                if (_this.touchControler.isMove) {
                    var speed = Math.abs(_this.touchControler.speed);
                    if (speed > 5 && speed < 20)
                        _this.friction = 0.995;
                    else
                        _this.friction = 0.95;
                    _this.touchControler.speed *= _this.friction;
                    if (speed < 1)
                        _this.touchControler.isMove = false;
                    // console.log(this.speed);
                    self.move(_this.touchControler.speed);
                }
            });
        }
        //  static onImageClick:Function;
        ImagesColumn.prototype.onPressHold = function (data) {
            var DO = data;
            var p = DO.localToGlobal(DO.x, DO.y);
            var im = $(data.image).clone();
            im.data('id', data.id);
            im.data('x', p.x);
            im.data('y', p.y);
            var e = new createjs.Event('IMAGE_SELECTED');
            e.data = im;
            this.dispatchEvent(e);
        };
        ImagesColumn.prototype.addImages = function (options) {
            var num = options.cols;
            var imgs = [];
            for (var i = 0, n = num; i < n; i++) {
                var bmp = this.lib.getNext();
                imgs.push(this.view.addChild(bmp));
            }
            this.images = imgs;
            this.arangeImages();
        };
        ImagesColumn.prototype.createBackground = function (color) {
            var sh = new createjs.Shape();
            sh.graphics.beginFill(color).drawRect(0, 0, this.opt.rowWidth, this.opt.rowHeight);
            this.view.addChildAt(sh, 0);
        };
        ImagesColumn.prototype.setPosition = function (x, y) {
            this.view.x = x;
            this.view.y = y;
        };
        //private isMove:boolean;
        ImagesColumn.prototype.addChild = function (onStart) {
            var bmp = this.lib.getNext();
            bmp.y = onStart ? 0 : this.opt.W;
            return this.view.addChild(bmp);
        };
        ImagesColumn.prototype.arangeImages = function () {
            var first = this.first;
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.y = i * this.dist + first;
            }
        };
        ImagesColumn.prototype.move = function (dist) {
            // if(this.speed>10 && dist<-10) return;
            // else if(this.speed<-10 && dist>10) return;
            /*if (this.speed != 0 && Math.abs(dist / this.speed) > 10) {
                //console.log('jump');
                return
            }*/
            this.touchControler.speed = dist;
            this.first += dist;
            this.arangeImages();
            //console.log(this.first, this.dist);
            if ((this.first) < -this.dist) {
                // console.log(this.first);
                var img = this.images.shift();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.y = -this.dist * 1.2;
                this.images.push(img);
                this.view.addChild(img);
                this.first = this.first + this.dist;
            }
            else if (this.first > 0) {
                //console.log(this.images.length);
                var img = this.images.pop();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.y = this.first - this.dist;
                this.images.unshift(img);
                this.view.addChild(img);
                //  console.log(this.first);
                this.first = this.first - this.dist;
            }
            // this.moveImages(dist);
            /// this.stage.update();
        };
        return ImagesColumn;
    }(EventDispatcher));
    hallmark.ImagesColumn = ImagesColumn;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImagesColumn.js.map