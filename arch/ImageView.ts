/**
 * Created by Администратор on 10.06.2016.
 */
//import {ImagesLoader} from "./ImagesLoader";

///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="ImagesColumn.ts"/>

    
    
namespace hallmark{
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Shape = createjs.Shape;
    
    
    
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
        constructor(private options:any){
            this.view = new Container();
            this.view.addEventListener('click',()=>{
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

        showImage(DO:DisplayObject,source:ModelImage) {
            this.start();
            this.view.removeAllChildren();
            DO = DO.parent;
            var pt = DO.localToGlobal(0, 0);
            var bmp:DisplayObject = this.imageView.setImage(this.view, source.large, pt.x, pt.y,
            this.options.thumbSize, this.options.thumbSize, this.options.previewWidth, this.options.previewHeight,
            this.options.prviewPaddingX, this.options.prviewPaddingY);

        }
    }
}
