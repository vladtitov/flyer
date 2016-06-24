/**
 * Created by VladHome on 1/28/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
///<reference path="TouchControler.ts"/>
///<reference path="ShopingCart.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var ImagesColumn = (function () {
        function ImagesColumn(lib, opt, id) {
            var _this = this;
            this.lib = lib;
            this.opt = opt;
            this.id = id;
            this.images = [];
            this.trigger = $({});
            this.speedSpin = 40;
            //view.setBounds(0,0,options.rowWidth,options.rowHeight);
            this.dist = opt.thumbDistance;
            var cont = new Container();
            cont.name = 'column_' + id;
            this.touchControler = new hallmark.TouchControler(cont);
            this.touchControler.on('click', function (evt) { return _this.onClicked(evt); });
            //  this.touchControler.trigger.on(TouchControler.PRESS_HOLD,(evt,data) => this.onPressHold (data))
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
                    _this.speed = Math.abs(_this.touchControler.speed);
                    if (_this.isFriction) {
                        if (_this.speed > 5 && _this.speed < 20)
                            _this.friction = 0.995;
                        else
                            _this.friction = 0.95;
                    }
                    else
                        _this.friction = 1;
                    _this.touchControler.speed *= _this.friction;
                    if (_this.speed < 5 && _this.touchControler.isSpin) {
                        _this.touchControler.isMove = false;
                        _this.stopOnImage();
                        _this.onMoveStop();
                    }
                    if (_this.speed < 1) {
                        _this.touchControler.isMove = false;
                        _this.onMoveStop();
                    }
                    self.move(_this.touchControler.speed);
                }
            });
        }
        ImagesColumn.prototype.onMoveStop = function () {
            this.trigger.triggerHandler('ON_MOVE_STOP');
        };
        ImagesColumn.prototype.stopOnImage = function () {
            this.first = 0;
            this.arangeImages();
        };
        ImagesColumn.prototype.addFriction = function () {
            this.isFriction = true;
        };
        ImagesColumn.prototype.isMove = function () {
            return this.touchControler.isMove;
        };
        ImagesColumn.prototype.spin = function () {
            this.isFriction = false;
            this.touchControler.spin(this.speedSpin);
        };
        ImagesColumn.prototype.on = function (event, callback) {
            this.trigger.on(event, callback);
        };
        ImagesColumn.prototype.off = function (event, callback) {
            this.trigger.off(event, callback);
        };
        //  static onImageClick:Function;
        ImagesColumn.prototype.onClicked = function (evt) {
            var model = this.getModel(evt.target);
            if (model)
                this.trigger.triggerHandler('selected', model);
            else
                console.warn(' no model for click ', evt);
        };
        ImagesColumn.prototype.getModel = function (cont) {
            for (var i = 0, n = this.images.length; i < n; i++)
                if (this.images[i].canvasView.id === cont.id)
                    return this.images[i];
            return null;
        };
        ImagesColumn.prototype.addImages = function (options) {
            var num = options.cols;
            var imgs = [];
            for (var i = 0, n = num; i < n; i++) {
                var model = this.lib.getNext();
                this.images.push(model);
                this.view.addChild(model.canvasView);
            }
            // this.images = imgs;
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
        /* addChild(onStart) {
             var bmp:DisplayObject = this.lib.getNext();
             bmp.y = onStart ? 0 : this.opt.W;
             return this.view.addChild(bmp);
         }*/
        ImagesColumn.prototype.arangeImages = function () {
            var first = this.first;
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i].setY(i * this.dist + first);
            }
        };
        ImagesColumn.prototype.move = function (delta) {
            this.first += delta;
            this.arangeImages();
            //console.log(this.first, this.dist);
            if ((this.first) < -this.dist) {
                // console.log(this.first);
                var img = this.images.shift();
                img.removeFrom(this.view);
                img = this.lib.getNext();
                img.setY(-this.dist * 1.2);
                this.images.push(img);
                img.appendTo(this.view);
                this.first = this.first + this.dist;
            }
            else if (this.first > 0) {
                //console.log(this.images.length);
                var img = this.images.pop();
                img.removeFrom(this.view);
                img = this.lib.getNext();
                img.setY(this.first - this.dist);
                this.images.unshift(img);
                img.appendTo(this.view);
                //  console.log(this.first);
                this.first = this.first - this.dist;
            }
        };
        return ImagesColumn;
    }());
    hallmark.ImagesColumn = ImagesColumn;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImagesColumn.js.map