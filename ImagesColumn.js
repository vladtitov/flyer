/**
 * Created by VladHome on 1/28/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="Gallery4.ts"/>
///<reference path="ImagesLibrary.ts"/>
var hallmark;
(function (hallmark) {
    var Container = createjs.Container;
    var ImagesColumn = (function () {
        function ImagesColumn(lib, opt, id) {
            //view.setBounds(0,0,options.rowWidth,options.rowHeight);
            var _this = this;
            this.lib = lib;
            this.opt = opt;
            this.id = id;
            this.images = [];
            this.speed = 0;
            this.dist = opt.thumbDistance;
            var cont = new Container();
            cont.name = 'column_' + id;
            this.view = cont;
            this.first = 0;
            this.addImages(opt);
            var prev = 0;
            var pressStart;
            this.view.addEventListener('mousedown', function (evt) {
                _this.isMove = false;
                _this.pointerid = evt.pointerID;
                prev = evt.stageY;
                pressStart = evt.stageY;
                if (Math.abs(_this.speed) > 5)
                    pressStart = 0;
                _this.speed = 0;
                clearTimeout(_this.holdTimer);
                _this.holdTimer = setTimeout(function () { return _this.onPressHold(evt); }, 1000);
            });
            this.view.addEventListener('mouseup', function (evt) {
                if (pressStart !== 0 && Math.abs(pressStart - evt.stageY) < 6) {
                    if (ImagesColumn.onImageClick)
                        ImagesColumn.onImageClick(evt.target);
                }
                _this.pointerid = -1;
                var self = _this;
                if (Math.abs(_this.speed) > 5) {
                    _this.isMove = true;
                }
            });
            /*this.view.addEventListener('pressmove',(evt:MouseEvent)=>{
                 if(evt.pointerID!==this.pointerid) return;
                 var now:number = evt.stageY;
                 var d:number = now - prev;
                 prev=now;
                 this.move(d);
             });*/
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
        ImagesColumn.prototype.onImageSelected = function (img) {
        };
        ;
        ImagesColumn.prototype.onPressHold = function (evt) {
            var DO = evt.target;
            var stage = this.view.stage;
            var p = DO.localToGlobal(DO.x, DO.y);
            var img = {};
            img.p = p;
            img.image = evt.target.image;
            this.onImageSelected(img);
            //this.view.dispatchEvent("IMAGE_SELECTED", img);
            return;
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
            this.speed = dist;
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
    }());
    hallmark.ImagesColumn = ImagesColumn;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImagesColumn.js.map