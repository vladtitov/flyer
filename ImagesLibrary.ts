/**
 * Created by VladHome on 1/29/2016.
 */
    ///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
    ///<reference path="Gallery4.ts"/>
    module hallmark {
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Shape = createjs.Shape;
    import Rectangle = createjs.Rectangle;

    interface VOImage {
        cats: string,
        large: string,
        name: string,
        price: number,
        sale: boolean,
        thumb: string
    }

    interface ImageThumb extends VOImage {
        categories: number []
    }

    export class ImageHolder extends Container implements ImageThumb {
        cats: string;
        large: string;
        name: string;
        price: number;
        sale: boolean;
        thumb: string;
        categories: number [];
        constructor(public vo:VOImage,size) {
            super();
            for ( var str in vo ) this [str] = vo [str];
            this.categories = vo.cats.split(",").map(Number);
            //this.name = String(vo)
            var img = new Image();
            img.src = vo.thumb;
            img.onload = (event)=> {
                var w = img.naturalWidth;
                var h = img.naturalHeight;
                var s:number = size / w;
                if (w < h) s = size / h;
                var bmp:createjs.Bitmap = new createjs.Bitmap(img);
                bmp.name='bmp';
                bmp.scaleX = s;
                bmp.scaleY = s;
                w = w * s;
                h = h * s;
                bmp.x = (size - w) / 2;
                bmp.y = (size - h) / 2;
                this.addChild(bmp);

              //  var cont:Container = new Container()
              //  cont.addChild(vo.sale?ImagesLibrary.instance.getPrice2():ImagesLibrary.instance.getPrice1());
              //  var txt:createjs.Text = new createjs.Text(vo.price, "30px Arial",'#FFFFFF');
               // txt.x = 10;
               // txt.y = 20;


               // cont.addChild(txt);
               // this.addChild(cont);

                this.cache(0, 0, size, size);

               ImagesLibrary.dispatcher.triggerHandler ("IMAGE_LOADED");
            }

            // var cont:Container = new Container();
            var sh:Shape = new Shape();
            sh.name='shape'
            sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);
            this.addChild(sh);

        }
    }


    /*export class VOImage{
        name:string;
        id:number;
        thumb:string;
        image:string;
        price:string;
        sale:boolean;
        cats:number[];
        constructor(obj,i:number){
            this.id=i;
            for(var str in obj)this[str] = obj[str];
            this.cats=obj.cats.split(',').map(Number);
        }

    }*/

    export class ImagesLibrary {
        //static onImageLoaded:Function;
        static dispatcher:JQuery = $({});
        data:ImageHolder[];
        private price1:Bitmap;
        private price2:Bitmap;
        static instance:ImagesLibrary;
        constructor(private options:any){
        //    ImagesLibrary.instance =  this;
        //    this.createPrices();
            this.loadData(options.url);
        }
  
        private loadData(url:string):void{
            $.get(url).done((res)=>{
                //console.log(res);
                //this.images.resolve(res);
                var out:ImageHolder[]=[];
                var size = this.options.thumbSize;
                for (var i = 0, n = res.length; i < n; i++) {
                    var image = new ImageHolder(res[i], size );
                    image.name = i + "";
                    out.push(image);
                }
                //this.data = out;
                this.images = out;
            })
        }
        

        getPrice1():Bitmap{
            return this.price1.clone();
        }
        getPrice2():Bitmap{
            return this.price2.clone();
        }
        createPrices():void{
            this.price1 = new Bitmap('media/assets/price1.png');
            this.price2 = new Bitmap('media/assets/price2.png');
        }
        private images:DisplayObject[] = [];
        current:number = 0;

        getImageByReference(DO:DisplayObject):ImageHolder{
            if(DO.name=='bmp' || DO.name=='shape'){
                return this.images[DO.parent.name];
            }
            return null;
        }
        addImages(num:number, ar:DisplayObject[]):void {
            this.images = this.images.concat(ar);
        }

        getNext():DisplayObject {
            this.current++;
            if (this.current >= this.images.length) this.current = 0;
            this.images[this.current].name=this.current.toString();
            return this.images[this.current].clone(true);
        }

        getPrev():DisplayObject {
            this.current--;
            if (this.current < 0) this.current = this.images.length - 1;

            // var cont = new Container();

            return this.images[this.current].clone(true);
        }

        setImageSize(num:number) {
            var ar = this.images;

            for (var i = 0, n = ar.length; i < n; i++) {
                console.log(ar[i].getBounds());
            }
        }

        loadThumbs(ar:VOImage[]):Container[]{
            var out:Container[]= [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                out.push(new ImageHolder(ar[i],this.options.thumbSize));
            }
            return out;
        }

    }

}