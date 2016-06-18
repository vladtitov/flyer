/**
 * Created by Vlad on 6/18/2016.
 */
    ///<reference path="CollectionImages.ts"/>


module hallmark{
    
    import Container = createjs.Container;
    import Shape = createjs.Shape;

    export interface VOImage {
        cats: string,
        large: string,
        name: string,
        price: number,
        sale: boolean,
        thumb: string
        id:number;
    }

    export class ModelImage {
        cats: string;
        large: string;
        name: string;
        price: number;
        sale: boolean;
        thumb: string;
        id:number;
        canvasView:Container;
        static thumbSize:number;
        static trigger:JQuery = $({});
        static IMAGE_LOADED:string = "IMAGE_LOADED";
        categories: number [];
        setX(x:number):ModelImage{
            this.canvasView.x=x;
            return this;
        }
        setY(y:number):ModelImage{
            this.canvasView.y=y;
            return this;
        }
        removeFrom(cont:Container):ModelImage{
            cont.removeChild(this.canvasView);
            return this;
        }
        appendTo(cont:Container):ModelImage{
            cont.addChild(this.canvasView);
            return this;
        }
        constructor(public vo:VOImage) {
            for ( var str in vo ) this [str] = vo [str];
            var size = ModelImage.thumbSize;
            this.categories = vo.cats.split(",").map(Number);
            //this.name = String(vo)
            this.canvasView= new Container();

            this.loadImage();

            var sh:Shape = new Shape();
            sh.name='shape'
            sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);
            this.canvasView.addChild(sh);

        }

        loadImage():void{
            var img = new Image();
            img.src = this.thumb;
            var size = ModelImage.thumbSize;
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
                this.canvasView.addChild(bmp);
                this.canvasView.cache(0, 0, size, size);
                ModelImage.trigger.triggerHandler (ModelImage.IMAGE_LOADED);

            }
        }

    }

}