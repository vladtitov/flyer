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
        private canvasView:JQuery;
        constructor(private options:any){
            this.canvasView =$("#canvasview");
            ModelImage.canvacView = this.canvasView;
            this.drag = new ImageDrag ();
            this.drag.trigger.on('ON_CART',()=>this.drag.dragOnCart());
            this.drag.cartX = $("#shopcart").offset().left;
            this.drag.cartY = $("#shopcart").offset().top;
            this.shopingCart = new ShopingCart;
            this.drag.shopingCart = this.shopingCart;
            this.drag.trigger.on ("DRAG_ON_CART", (evt, model) => this.shopingCart.addItem(model));
            this.drag.trigger.on ("ON_TOGGLE", (evt) => this.toggleOn());
            var canv = document.createElement('canvas');
            canv.width = options.canvasWidth;
            canv.height = options.canvasHeight;
            this.canvasView.append(canv);
            this.stage = new createjs.Stage(canv);
            //this.data = data;
            this.imagesLibrary = new CollectionImages(options);
             this.imagesLibrary.trigger.on(this.imagesLibrary.GOT_50,()=>{
                 this.createColumns(options);
             })
            this.initSpin();
            this.initCart();
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

        private dragedOnCart():void{
            var model:ModelImage = this.drag.model;
            this.drag.reset();
        }

        collectionColumn:ImagesColumn [];

        createColumns(options):void{
            this.collectionColumn = [];
            for(var i=0; i<3; i++) {
                var column:ImagesColumn = new ImagesColumn(this.imagesLibrary,options,i);
                column.setPosition(i*106+22, 0);
                //column.createBackground('#3c763d');
                this.stage.addChild(column.view);
                column.on('selected',(evt,model:ModelImage)=> this.onImageSelected(model));
                column.on('ON_MOVE_STOP', (evt) => this.onColumnStop());
                this.collectionColumn.push(column);
              // column.tr
                //column.view.addEventListener("IMAGE_SELECTED", (evt)=> this.onImageSelected(evt));
               // column.onImageSelected = (img) => this.onImageSelected(img);

            }
        }

        onColumnStop ():void {
            var stop:boolean = true;
            this.collectionColumn.forEach( function (item:ImagesColumn) {
                if (item.isMove () ) stop = false;
            });
            if (stop) {
                $('#spin').css("background-image", "url('btn_spin_normal.png')");
                this.initSpin();
            };
        };
        
        private onImageSelected (model:ModelImage):void {
            this.showItem ();
            this.drag.setImage(model);
        }

        initSpin ():void {
            $('#spin').click( () => {
                $('#spin').css("background-image", "url('btn_spin_press.png')");
                $('#spin').unbind("click");
                this.collectionColumn.forEach( function (item:ImagesColumn) {
                    item.spin();
                } );
                setTimeout( () => {
                   this.stopColumn(2);
                },2000);
                setTimeout( () => {
                    this.stopColumn(1);
                },3000);
                setTimeout( () => {
                    this.stopColumn(0);
                },4000);
            });
        }

        stopColumn (num:number):void {
            this.collectionColumn[num].addFriction();
        }

        showItem() {
            $('#shopcartitems').css("display", "block");
            $('#spin').css("display", "none");
            $('#shopcart').unbind("click");
        }

        toggleView() {
            $('#shopcartitems').toggle();
            $('#spin').toggle();
        }

        toggleOn() {
            $('#shopcart').click(function () {
                $('#shopcartitems').toggle();
                $('#spin').toggle();
            });
        }

        initCart () {
            window.addEventListener("resize", (evt)=> {
                this.drag.cartX = $("#shopcart").offset().left;
                this.drag.cartY = $("#shopcart").offset().top;
             });
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
        constructor(opt:any){
            this.gallery = new hallmark.Gallery4(opt);
        }
    }


}




$(document).ready(function(){
    console.log($(window ).width()+'x'+$(window ).height());
    var width  = $('#slots').width();
    var height  = 320;
    
    $('#shopcart').click(function(){
        $('#shopcartitems').toggle();
        $('#spin').toggle();
    });

    var options={
        canvasWidth:width,
        canvasHeight:height,
        server:'http://192.168.0.102/GitHub/flyer/',
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

    var gal = new hallmark.App(options);
})

