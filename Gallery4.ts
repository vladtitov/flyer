//import {ImagesLoader} from "./ImagesLoader";
/**
 * Created by VladHome on 1/8/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
/// <reference path="../typings/tweenjs.d.ts" />
/// <reference path="../typings/easeljs.d.ts" />
///<reference path="ImagesRow.ts"/>
///<reference path="ImagesLibrary.ts"/>

    declare var require:any;

    
namespace hallmark{

    interface Options {
        canvasWidth: number;
        canvasHeight: number;
        getimages: string;
        thumbSize: number;
        rowHeight: number;
        rowWidth: number;
        rows:number;
        cols: number;
        prviewPaddingX:number;
        prviewPaddingY:number;
        previwWidth:number;
        previwHeight:number;
    }
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Shape = createjs.Shape;


   export class ImagesRowOpt{
        imageWidth:number;
        imageHeight:number;
        W:number;
        H:number;
        defaultSpeed:number;

    }

    export class ImageView{

        onImageReady:Function;
       setImage(cont:Container,url:string,x:number,y:number,fromW:number,fromH:number,toW:number,toH:number,paddingX:number,paddingY:number):DisplayObject{
           var img = new Image();
           img.src = url;
           var bmp:createjs.Bitmap = new createjs.Bitmap(img);
           bmp.x=x;
           bmp.y=y;
           img.onload = (event)=> {
               var w = img.naturalWidth;
               var h = img.naturalHeight;
               var scaleX = fromW/w;
               var scaleY = fromH/h;
               var scale=scaleX;
               if(scaleX>scaleY) scale = scaleY;
               bmp.scaleX = scale;
               bmp.scaleY = scale;
               bmp.x+= (fromW -(w*scale)) / 2;
               bmp.y+= (fromH - (h*scale)) / 2;
               scaleX = toW/w;
               scaleY = toH/h;
               scale = (scaleX>scaleY)?scaleY:scaleX;

               x = (toW -(w*scale))/2;
               y = (toH-(h*scale))/2;

               if(this.onImageReady)this.onImageReady();
               createjs.Tween.get(bmp).to({scaleX:scale,scaleY:scale,x:x+paddingX,y:y+paddingY}, 500,createjs.Ease.quadIn).call(()=>this.onZoomInComplete());
               cont.addChild(bmp);
           }
           return bmp;
       }

        private onZoomInComplete(){

        }
        private zoomImage():void{

        }
    }

    export class ImagePreview{
        view:Container;
        onClick:Function;

        current:DisplayObject;
        imageView:ImageView;
        constructor(private options:Options){
            this.view = new Container();
            this.view.addEventListener('click',()=>{
                console.log('click');
                this.removeMe();
                if(this.onClick)this.onClick();
            })

            var self = this;
            this.ticker = function(){
                self.tick();
            }

            this.imageView = new ImageView();
            this.imageView.onImageReady = ()=>{

            }

        }

        num:number;

        ticker:EventListener;
        start():void{
            this.num=0;
            createjs.Ticker.addEventListener("tick",this.ticker);
        }
        stop():void{
            var ticker = this.ticker;
            createjs.Ticker.removeEventListener("tick",this.ticker);
        }
        tick():void{

        this.num++;
           // console.log(this.num);
           // console.log('tick');
        }

        removeMe():void{
            this.num=0;
            this.stop();
            this.view.parent.removeChild(this.view)
        }

        showImage(DO:DisplayObject,source:ImageHolder) {
            this.start();
            this.view.removeAllChildren();

            DO = DO.parent;
            var pt = DO.localToGlobal(0, 0);
            var bmp:DisplayObject = this.imageView.setImage(this.view, source.vo.image, pt.x, pt.y,
                this.options.thumbSize, this.options.thumbSize, this.options.previwWidth, this.options.previwHeight,
                this.options.prviewPaddingX, this.options.prviewPaddingY);

        }
    }

    export class Gallery4{
        stage:createjs.Stage;
        data:VOImage[];
        isWebGL:boolean
        imagesLibrary:ImagesLibrary;
        private current:number;
        private preview:ImagePreview;
        constructor($view,data:VOImage[],options:any){

            var canv = document.createElement('canvas');
            canv.width = options.canvasWidth;
            canv.height = options.canvasHeight;
            $view.append(canv);
           this.stage = new createjs.Stage(canv);
            this.data = data;
            this.imagesLibrary = new ImagesLibrary(data,options);
            var count = 0;
            ImagesLibrary.onImageLoaded = ()=>{
                count++;
                //console.log(count);
              if(count>50){
                  ImagesLibrary.onImageLoaded = null;
                  this.createRows(options);
              }
            }

           ImagesRow.onImageClick = (DO:DisplayObject)=>{
              var img:ImageHolder =  this.imagesLibrary.getImageByReference(DO);
               if(img) this.preview.showImage(DO,img);
               this.stage.addChild(this.preview.view);
           }

            this.preview = new ImagePreview(options);


           // this.isWebGL = this.stage.isWebGL

            createjs.Touch.enable(this.stage);
            createjs.Ticker.framerate = 60;
            var stage = this.stage;
            var  stamp=Date.now();
            var count = 0;

            createjs.Ticker.addEventListener("tick",(num:number)=>{
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
        createRows(options):void{

            for(var i=0,n=options.rows;i<n;i++){
                var row:ImagesRow = new ImagesRow(this.imagesLibrary,options,i);
                row.setPosition(0,i*options.rowHeight);
                row.createBackground('#999999');
                this.stage.addChild(row.view);
            }
        }

    }

    interface Images{
    name:string;
        jpgs:string[];
        folder:string;
        ns:string;
    }
    export class App{
        images:JQueryDeferred<VOImage[]>;
        gallery:Gallery4;
        constructor($view:JQuery,opt:any){


            this.images=$.Deferred();
            this.loadData(opt.getimages);
            this.init($view,opt);
           // require(['easel','tween'],()=>{
              //  require(['js/videopuzzle/ImageHolder','js/videopuzzle/Camera','js/videopuzzle/Puzzles','js/videopuzzle/myPuzzle'], ()=> {
                  //  this.init($view);

               // });
           // });
        }

        init($view,options):void{
          //  console.log($view);

            this.images.then((data)=>{

                this.gallery = new hallmark.Gallery4($view,data,options);
                if(this.gallery.isWebGL){
                    $('body').css('background','#00FF00');
                }else{

                }

            })

        }

        loadData(url:string):void{
            $.get(url).done((res)=>{
             //  console.log(res);
                this.images.resolve(res);
            })
        }
    }
}



