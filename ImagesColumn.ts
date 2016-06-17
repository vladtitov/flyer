/**
 * Created by VladHome on 1/28/2016.
 */
    ///<reference path="typings/jquery.d.ts"/>
    /// <reference path="typings/tweenjs.d.ts" />
    /// <reference path="typings/easeljs.d.ts" />
    ///<reference path="Gallery4.ts"/>
    ///<reference path="ImagesLibrary.ts"/>
    ///<reference path="TouchControler.ts"/>
    
    


    
module hallmark {
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Shape = createjs.Shape;
    import Point = createjs.Point;
    import EventDispatcher = createjs.EventDispatcher;
    
    export class ImagesColumn extends EventDispatcher{
        images:DisplayObject[] = [];
        view:Container;

        //private speed:number = 0;
        pointerid:number;
        private dist:number;
        private holdTimer:number;
        touchControler:TouchControler;

        constructor(private  lib:ImagesLibrary, private opt:any, private id:number) {
            super();
            //view.setBounds(0,0,options.rowWidth,options.rowHeight);

            this.dist = opt.thumbDistance;

            var cont:Container = new Container();
            cont.name = 'column_' + id;

            this.touchControler = new TouchControler(cont);
            this.touchControler.trigger.on(TouchControler.PRESS_HOLD,(evt,data) => this.onPressHold (data))
            this.touchControler.move = (evt) => this.move (evt);
            this.view = cont;
            this.first = 0;

            this.addImages(opt);

            var prev:number = 0;

            var pressStart:number;
            var self = this;
            var count = 0;
            var stamp = Date.now();

            createjs.Ticker.addEventListener("tick", ()=> {
                if (this.touchControler.isMove) {
                    var speed = Math.abs(this.touchControler.speed);
                    if (speed > 5 && speed < 20) this.friction = 0.995;
                    else  this.friction = 0.95;
                    this.touchControler.speed *= this.friction;
                    if (speed < 1) this.touchControler.isMove = false;
                    // console.log(this.speed);
                    self.move(this.touchControler.speed);
                }
            });


        }

      //  static onImageClick:Function;


        private onPressHold (data) {
            var DO:DisplayObject = < DisplayObject >data;
            var p:Point = DO.localToGlobal(DO.x, DO.y);
            var im:JQuery = $(data.image).clone();
            im.data('id',data.id);
            im.data('x',p.x);
            im.data('y',p.y);
            var e:createjs.Event = new createjs.Event('IMAGE_SELECTED');
            e.data = im;
            this.dispatchEvent(e)
        }

        private addImages(options):void {
            var num = options.cols;
            var imgs:DisplayObject[] = [];
            for (var i = 0, n = num; i < n; i++) {
                var bmp:DisplayObject = this.lib.getNext();
                imgs.push(this.view.addChild(bmp));
            }

            this.images = imgs;
            this.arangeImages();
        }

        createBackground(color):void {
            var sh = new createjs.Shape();
            sh.graphics.beginFill(color).drawRect(0, 0, this.opt.rowWidth, this.opt.rowHeight);
            this.view.addChildAt(sh, 0);
        }

        setPosition(x:number, y:number):void {
            this.view.x = x;
            this.view.y = y;
        }

        private friction:number;
        //private isMove:boolean;


        addChild(onStart) {
            var bmp:DisplayObject = this.lib.getNext();
            bmp.y = onStart ? 0 : this.opt.W;
            return this.view.addChild(bmp);
        }

        private arangeImages() {
            var first = this.first;
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.y = i * this.dist + first;
            }
        }

        private first:number;

        move(dist):void {
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
                var img:DisplayObject = this.images.shift();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.y = -this.dist * 1.2;
                this.images.push(img);
                this.view.addChild(img);
                this.first = this.first + this.dist;
                // this.arangeImages();

            } else if (this.first > 0) {
                //console.log(this.images.length);
                var img:DisplayObject = this.images.pop();
                this.view.removeChild(img);
                img = this.lib.getNext();
                img.y = this.first - this.dist;
                this.images.unshift(img);
                this.view.addChild(img);
                //  console.log(this.first);
                this.first = this.first - this.dist;
                //   console.log(this.first);
                //  this.arangeImages();
            }



            // this.moveImages(dist);
            /// this.stage.update();

        }

        /*private moveImages(dist){
         var ar = this.images;
         for (var i = 0; i < 3; i++) {
         var item = ar[i];
         item.y=item.y+dist;
         if(item.y>this.opt.H || item.y<-this.opt.imageHeight){
         this.view.removeChild(item);
         ar[i] = this.addChild(item.y>0);
         }
         // this.arangeImages2();
         }
         }*/
    }

}