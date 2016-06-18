/**
 * Created by VladHome on 1/8/2016.
 */
///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
///<reference path="ImagesColumn.ts"/>
///<reference path="CollectionImages.ts"/>
///<reference path="ImageView.ts"/>
///<reference path="ImageDrag.ts"/>
///<reference path="ShopingCart.ts"/>



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

   

    export class Gallery4{
        stage:createjs.Stage;
        //data:VOImage[];
        isWebGL:boolean;
        imagesLibrary:CollectionImages;
        private current:number;
        private preview:ImagePreview;
        private drag:ImageDrag;
        private shopingCart:ShopingCart;
        constructor(private $view:JQuery, options:any){
            this.drag = new ImageDrag ($view);
            this.shopingCart = new ShopingCart;
            this.drag.trigger.on ("DRAG_ON_CART", (evt, img) => this.shopingCart.addItem(img));
            var canv = document.createElement('canvas');
            canv.width = options.canvasWidth;
            canv.height = options.canvasHeight;
            $view.append(canv);
            this.stage = new createjs.Stage(canv);
            //this.data = data;
            this.imagesLibrary = new CollectionImages(options);
         this.imagesLibrary.trigger.on(this.imagesLibrary.GOT_50,()=>{
             this.createColumns(options);
         })
  
           /* ImagesColumn.onImageClick = (DO:DisplayObject)=>{
                var img:ModelImage =  this.imagesLibrary.getImageByReference(DO);
                if(img) this.preview.showImage(DO,img);
                this.stage.addChild(this.preview.view);
            }*/

            this.preview = new ImagePreview(options);

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


        /*element = document.getElementById('spin');

        element.addEventListener('click', (evt:MouseEvent)=> {
            move (20);
        });*/
        
        createColumns(options):void{
          
            for(var i=0; i<3; i++) {
                var column:ImagesColumn = new ImagesColumn(this.imagesLibrary,options,i);
                column.setPosition(i*100+5, 10);
                //column.createBackground('#3c763d');
                this.stage.addChild(column.view);
                
              // column.tr
                //column.view.addEventListener("IMAGE_SELECTED", (evt)=> this.onImageSelected(evt));
               // column.onImageSelected = (img) => this.onImageSelected(img);

            }

        }

        private onImageSelected (evt:createjs.Event) {     
            
           this.drag.setImage(evt.data);
        }
    }

    interface Images{
    name:string;
        jpgs:string[];
        folder:string;
        ns:string;
    }
    export class App{
        //images:JQueryDeferred<VOImage[]>;
        gallery:Gallery4;
        constructor($view:JQuery,opt:any){
            this.gallery = new hallmark.Gallery4($view, opt);
        }
    }
}




$(document).ready(function(){
    console.log($(window ).width()+'x'+$(window ).height());
    var width  = $(window ).width();
    var height  = $(window ).height()-230;

    $('#shopcart').click(function(){
        $('#shopcartitems').toggle();
        $('#spin').toggle();
    });



    

    var options={
        canvasWidth:width,
        canvasHeight:height,
        server:'http://192.168.1.11/GitHub/flyer/',
        getimages:'getimages.php',
        thumbSize:100,
        thumbDistance:110,
        rowHeight: height,
        rowWidth: 105,
        // rows:5,
        //  cols:4,
        rows:7,
        cols:5,
        prviewPaddingX:10,
        prviewPaddingY:10,
        previewWidth:width-20,
        previewHeight:height-20
    }

    var gal = new hallmark.App($('#mainview'),options);
})

