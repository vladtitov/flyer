/**
 * Created by Vlad on 6/18/2016.
 */
    ///<reference path="CollectionImages.ts"/>


module hallmark{
    
    import Container = createjs.Container;
    import Shape = createjs.Shape;
    import Point = createjs.Point;

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
        static canvacView:JQuery;
        cats: string;
        large: string;
        name: string;
        price: number;
        sale: boolean;
        thumb: string;
        id:number;
        image:HTMLImageElement;
        $image:JQuery;
        canvasView:Container;
        static thumbSize:number;
        static trigger:JQuery = $({});
        static IMAGE_LOADED:string = "IMAGE_LOADED";
        categories: number [];
        private curScale:number = 1;
        private curRotation:number = 0;
        public curOffset: {left:number; top:number};

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
            this.canvasView.mouseChildren = false;
            this.canvasView.name= 'canvasView_'+this.id;
            this.loadImage();
            var sh:Shape = new Shape();
            sh.name='shape'
            sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);
            this.canvasView.addChild(sh);

        }


        removeDragImage():ModelImage{
            var $img:JQuery = this.$image
            $img.fadeOut('slow',function () { $img.remove(); });
            return this;
        }

        appendToDrag($cont:JQuery):ModelImage{
            this.$image = $(this.image).clone();
            this.$image.on('remove_me',()=>this.removeDragImage());
            var off = ModelImage.canvacView.offset();
            var p:Point = this.canvasView.localToGlobal(0,0);
            off.left+=p.x;
            off.top+=p.y;
            this.$image.offset(off).appendTo($cont);
            return this;
        }

        setOffset(o:{left:number; top:number}):JQuery {
            this.curOffset = o;
            return this.$image.offset(o)
        }

        getOffset (): {left:number; top:number} {
            return this.$image.offset();
        }

        setScale (num:number) {
            this.curScale = num;
            this.$image.css ("transform", "scale("+ this.curScale +") rotate(" + this.curRotation + "deg)");
        }

        getScale ():number {
            return this.curScale;
        }

        setRotation (num:number) {
            console.log(num);
            this.curRotation = num;
            this.$image.css ("transform", "scale("+ this.curScale +") rotate(" + this.curRotation + "deg)");
        }

        getRotation ():number {
            return this.curRotation;
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

            };
            this.image = img;

        }

    }

}