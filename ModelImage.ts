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
        imageClone:HTMLImageElement;
        $image:JQuery;
        canvasView:Container;
        static thumbSize:number;
        static trigger:JQuery = $({});
        static IMAGE_LOADED:string = "IMAGE_LOADED";
        categories: number [];
        transform : {translate: {x: number; y:number};
            scale: number;
            angle: number;
            rx: number;
            ry: number;
            rz: number;
        };

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
            this.resetElement ();
            this.loadImage();
            var sh:Shape = new Shape();
            sh.name='shape'
            /*sh.graphics.beginFill('#FFFFFF').drawRect(0, 0, size, size);*/
            this.canvasView.addChild(sh);

        }

        resetElement ():ModelImage {
            this.transform = {translate: {x:0, y:0},
                scale: 1,
                angle: 0,
                rx: 0,
                ry: 0,
                rz: 0
            };
            return this;
        }
        
        removeDragImage():ModelImage{
            var $img:JQuery = this.$image;
            $img.fadeOut('slow',function () { $img.remove(); });
            return this;
        }

        appendToDrag($cont:JQuery):ModelImage{
            this.$image = $(this.image).clone();
            this.imageClone = this.$image.get(0);
            this.$image.on('remove_me',()=>this.removeDragImage());
            var off = ModelImage.canvacView.offset();
            var p:Point = this.canvasView.localToGlobal(0,0);
            /*off.left+=p.x;
            off.top+=p.y;*/
            this.transform.translate.x = off.left+p.x;
            this.transform.translate.y = off.top+p.y;
            this.$image.appendTo($cont);
            return this;
        }

        setOffset(x:number, y:number) {
            this.transform.translate.x = x;
            this.transform.translate.y = y;
        }

        getOffset (): {x:number; y:number} {
            return {x:this.transform.translate.x, y:this.transform.translate.y};
        }

        private transformType:string = "transform";

        renderTransform () {
             var value_array:string [] = [
                'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
                 'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
                'rotate3d('+ this.transform.rx +','+ this.transform.ry +','+ this.transform.rz +','+  this.transform.angle + 'deg)'
                 ];

             var value:string = value_array.join(" ");
             this.imageClone.style.webkitTransform = value;
             //this.image.style.mozTransform = value;
             //this.image.style[this.transformType] = value;

        }

        setScale (scale:number) {
            this.transform.scale = scale;
        }

        setAngle (angle:number) {
            this.transform.rz = 1;
            this.transform.angle = angle;
        }


        getScale ():number {
            return this.transform.scale;
        }

        getAngle ():number {
            return this.transform.angle;
        }

        loadImage():void{
            var img = new Image();
          // img.crossOrigin = "anonymous";
            img.src = this.thumb;

            var size = ModelImage.thumbSize;

            img.onload = (event)=> {

                var w = img.naturalWidth;
                var h = img.naturalHeight;
                var s:number = size / w;
                if (w < h) s = size / h;

                var bmp:createjs.Bitmap = new createjs.Bitmap(img);
             //   bmp.cache( 0, 0,size, size);

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