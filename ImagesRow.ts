/**
 * Created by VladHome on 1/28/2016.
 */
    ///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
    ///<reference path="Gallery4.ts"/>

module hallmark{
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Shape = createjs.Shape;

export class ImagesRow{
    images:DisplayObject[]=[];
    view:Container;

    private speed:number=0;
    pointerid:number;
    private dist:number;

    constructor(private  lib:ImagesLibrary,private opt:any, private id:number){
        //view.setBounds(0,0,options.rowWidth,options.rowHeight);

        this.dist=opt.thumbDistance;

        var cont:Container = new Container();
        cont.name = 'row_'+id;

        this.view = cont;
        this.first=0;

        this.addImages(opt);

        var prev:number=0;

        var pressStart:number;
        this.view.addEventListener('mousedown',(evt:MouseEvent)=> {
            this.isMove = false;
            this.pointerid = evt.pointerID;
            prev = evt.stageX;
            pressStart = evt.stageX;
            if(Math.abs(this.speed)>5)pressStart=0;
            this.speed=0;
            clearInterval(this.interval);
        });

        this.view.addEventListener('pressup',(evt:MouseEvent)=>{

            if(pressStart !==0 && Math.abs(pressStart-evt.stageX)<6){
                if(ImagesRow.onImageClick)ImagesRow.onImageClick(evt.target)
            }
            this.pointerid=-1;
            var self = this;
            if(Math.abs(this.speed)>5){
                this.isMove=true;
            }
        });

        this.view.addEventListener('pressmove',(evt:MouseEvent)=>{
            //  console.log(evt);
            if(evt.pointerID!==this.pointerid) return;
            var now:number = evt.stageX;
            var d:number = now - prev;
            prev=now;
            this.move(d)
        });


        var self = this;
        var count=0;
        var stamp = Date.now();

        createjs.Ticker.addEventListener("tick",()=>{
            if(this.isMove){
                var speed = Math.abs(this.speed);
               if(speed>5 && speed<20) this.friction = 0.995;
              else  this.friction = 0.95;
                this.speed *= this.friction;
                if(speed<1) this.isMove = false;
               // console.log(this.speed);
                self.move(this.speed);
            }
        });


    }

    static onImageClick:Function;
    private addImages(options):void{
      var num = options.cols;//  Math.floor(options.canvasWidth/options.thumbSize);
        var imgs:DisplayObject[]=[];
        for (var i = 0, n = num; i < n; i++) {
            var bmp:DisplayObject = this.lib.getNext();
            imgs.push(this.view.addChild(bmp));
        }

        this.images = imgs;
        this.arangeImages();
    }

    createBackground(color):void{
        var sh = new createjs.Shape();
        sh.graphics.beginFill(color).drawRect(0, 0, this.opt.rowWidth, this.opt.rowHeight);
        this.view.addChildAt(sh,0);
    }
    setPosition(x:number,y:number):void{
        this.view.x=x;
        this.view.y=y;
    }

    private friction:number;
    private isMove:boolean;
    private interval:number;

    addChild(onStart){
        var bmp:DisplayObject = this.lib.getNext();
        bmp.x=onStart?0:this.opt.W;
        return  this.view.addChild(bmp);
    }

    private arangeImages(){
        var first = this.first;
        var ar = this.images;
        for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[i];
            item.x=i*this.dist+first;
        }
    }



    private first:number;
    move(dist):void{
        // if(this.speed>10 && dist<-10) return;
        // else if(this.speed<-10 && dist>10) return;
        if(this.speed !=0 && Math.abs(dist/this.speed)>10) {
            console.log('jump');
            return
        }

        this.speed = dist;
       this.first+=dist;
       this.arangeImages();

        if(this.first<-this.dist) {
           // console.log(this.first);
            var img:DisplayObject = this.images.shift();
            this.view.removeChild(img);
            img = this.lib.getNext();
            img.x = -this.dist*1.2;
            this.images.push(img);
            this.view.addChild(img)
            this.first = this.first + this.dist;
           // this.arangeImages();

        } else if(this.first>0){
            console.log(this.images.length);
            var img:DisplayObject = this.images.pop();
            this.view.removeChild(img);
            img = this.lib.getNext();
           img.x = this.first - this.dist;

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


    private moveImages(dist){
        var ar = this.images;
        for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[i];
            item.x=item.x+dist;
            if(item.x>this.opt.W || item.x<-this.opt.imageWidth){
                this.view.removeChild(item);
                ar[i] = this.addChild(item.x>0);
            }
           // this.arangeImages2();
        }
    }
}


}