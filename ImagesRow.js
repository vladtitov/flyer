/**
 * Created by VladHome on 1/28/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
/// <reference path="../typings/tweenjs.d.ts" />
/// <reference path="../typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var ImagesRow = (function () {
        function ImagesRow(lib, opt, id) {
            //view.setBounds(0,0,options.rowWidth,options.rowHeight);
            var _this = this;
            this.lib = lib;
            this.opt = opt;
            this.id = id;
            this.images = [];
            this.speed = 0;
            this.dist = opt.thumbDistance;
            var cont = new Container();
            cont.name = 'row_' + id;
            this.view = cont;
            this.first = 0;
            this.addImages(opt);
            var prev = 0;
            var pressStart;
            this.view.addEventListener('mousedown', function (evt) {
                _this.isMove = false;
                _this.pointerid = evt.pointerID;
                prev = evt.stageX;
                pressStart = evt.stageX;
                if (Math.abs(_this.speed) > 5)
                    pressStart = 0;
                _this.speed = 0;
                clearInterval(_this.interval);
            });
            this.view.addEventListener('pressup', function (evt) {
                if (pressStart !== 0 && Math.abs(pressStart - evt.stageX) < 6) {
                    if (ImagesRow.onImageClick)
                        ImagesRow.onImageClick(evt.target);
                }
                _this.pointerid = -1;
                var self = _this;
                if (Math.abs(_this.speed) > 5) {
                    _this.isMove = true;
                }
            });
            this.view.addEventListener('pressmove', function (evt) {
                //  console.log(evt);
                if (evt.pointerID !== _this.pointerid)
                    return;
                var now = evt.stageX;
                var d = now - prev;
                prev = now;
                _this.move(d);
            });
            var self = this;
            var count = 0;
            var stamp = Date.now();
            createjs.Ticker.addEventListener("tick", function () {
                if (_this.isMove) {
                    var speed = Math.abs(_this.speed);
                    if (speed > 5 && speed < 20)
                        _this.friction = 0.995;
                    else
                        _this.friction = 0.95;
                    _this.speed *= _this.friction;
                    if (speed < 1)
                        _this.isMove = false;
                    // console.log(this.speed);
                    self.move(_this.speed);
                }
            });
        }
        ImagesRow.prototype.addImages = function (options) {
            var num = options.cols; //  Math.floor(options.canvasWidth/options.thumbSize);
            var imgs = [];
            for (var i = 0, n = num; i < n; i++) {
                var bmp = this.lib.getNext();
                imgs.push(this.view.addChild(bmp));
            }
            this.images = imgs;
            this.arangeImages();
        };
        ImagesRow.prototype.createBackground = function (color) {
            var sh = new createjs.Shape();
            sh.graphics.beginFill(color).drawRect(0, 0, this.opt.rowWidth, this.opt.rowHeight);
            this.view.addChildAt(sh, 0);
        };
        ImagesRow.prototype.setPosition = function (x, y) {
            this.view.x = x;
            this.view.y = y;
        };
        ImagesRow.prototype.addChild = function (onStart) {
            var bmp = this.lib.getNext();
            bmp.x = onStart ? 0 : this.opt.W;
            return this.view.addChild(bmp);
        };
        ImagesRow.prototype.arangeImages = function () {
            var first = this.first;
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.x = i * this.dist + first;
            }
        };
        ImagesRow.prototype.move = function (dist) {
            // if(this.speed>10 && dist<-10) return;
            // else if(this.speed<-10 && dist>10) return;
            if (this.speed != 0 && Math.abs(dist / this.speed) > 10) {
                console.log('jump');
                return;
            }
            this.speed = dist;
            this.first += dist;
            this.arangeImages();
            if (this.first < -this.dist) {
                // console.log(this.first);
                var img = this.images.shift();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.x = -this.dist * 1.2;
                this.images.push(img);
                this.view.addChild(img);
                this.first = this.first + this.dist;
            }
            else if (this.first > 0) {
                console.log(this.images.length);
                var img = this.images.pop();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.x = this.first - this.dist;
                this.images.unshift(img);
                this.view.addChild(img);
                //  console.log(this.first);
                this.first = this.first - this.dist;
            }
            // this.moveImages(dist);
            /// this.stage.update();
        };
        ImagesRow.prototype.moveImages = function (dist) {
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.x = item.x + dist;
                if (item.x > this.opt.W || item.x < -this.opt.imageWidth) {
                    this.view.removeChild(item);
                    ar[i] = this.addChild(item.x > 0);
                }
            }
        };
        return ImagesRow;
    }());
    hallmark.ImagesRow = ImagesRow;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImagesRow.js.map