/**
 * Created by VladHome on 1/28/2016.
 */
    ///<reference path="typings/jquery.d.ts"/>
    /// <reference path="typings/tweenjs.d.ts" />
    /// <reference path="typings/easeljs.d.ts" />
    ///<reference path="Gallery4.ts"/>
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
    
    export class ImagesColumn {
        images:ModelImage[] = [];
        view:Container;

        //private speed:number = 0;
        pointerid:number;
        private dist:number;
        private holdTimer:number;
        touchControler:TouchControler;
        trigger:JQuery = $({});

        constructor(private  lib:CollectionImages, private opt:any, private id:number) {

            //view.setBounds(0,0,options.rowWidth,options.rowHeight);
            this.dist = opt.thumbDistance;

            var cont:Container = new Container();
            cont.name = 'column_' + id;

            this.touchControler = new TouchControler(cont);
            this.touchControler.on('click',(evt)=>this.onClicked(evt));

          //  this.touchControler.trigger.on(TouchControler.PRESS_HOLD,(evt,data) => this.onPressHold (data))
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

        on(event:string,callback:Function):void{
            this.trigger.on(event,callback);
        }
        off(event:string,callback:Function):void{
            this.trigger.off(event,callback);
        }

      //  static onImageClick:Function;


        private onClicked (evt) {
            var model:ModelImage = this.getModel(evt.target);
            if(model)this.trigger.triggerHandler('selected',model);
            else console.warn(' no model for click ',evt);
        }

        private getModel(cont:Container):ModelImage{
            for(var i = 0,n=this.images.length;i<n;i++)if(this.images[i].canvasView.id === cont.id) return this.images[i];
        return null
    }
        
        private addImages(options):void {
            var num = options.cols;
            var imgs:DisplayObject[] = [];
            for (var i = 0, n = num; i < n; i++) {
                var model:ModelImage = this.lib.getNext();
                this.images.push(model);
                this.view.addChild(model.canvasView)
                //imgs.push(this.view.addChild(bmp));
            }

           // this.images = imgs;
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


       /* addChild(onStart) {
            var bmp:DisplayObject = this.lib.getNext();
            bmp.y = onStart ? 0 : this.opt.W;
            return this.view.addChild(bmp);
        }*/

        private arangeImages() {
            var first = this.first;
            var ar = this.images;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i].setY(i * this.dist + first);
               // item.y = i * this.dist + first;
            }
        }

        private first:number;

        move(delta):void {
            this.first += delta;
            this.arangeImages();
            //console.log(this.first, this.dist);
            if ((this.first) < - this.dist) {
                // console.log(this.first);
                var img:ModelImage = this.images.shift();
                img.removeFrom(this.view);
                
                img = this.lib.getNext();                
                img.setY(-this.dist * 1.2);
                this.images.push(img);
                img.appendTo(this.view);
                this.first = this.first + this.dist;
                // this.arangeImages();

            } else if (this.first > 0) {
                //console.log(this.images.length);
                var img:ModelImage = this.images.pop();
                img.removeFrom(this.view);
                img = this.lib.getNext();
                img.setY(this.first - this.dist);
                this.images.unshift(img);
               img.appendTo(this.view);
                //  console.log(this.first);
                this.first = this.first - this.dist;
                //   console.log(this.first);
                //  this.arangeImages();
            }           

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