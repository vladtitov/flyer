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

        private d_offset:{left:number;top:number};

        setDefaultOffcet(o:{left:number;top:number}){
            this.d_offset = o;
        }
        appendToDrag($cont:JQuery):ModelImage{
            this.$image = $(this.image).clone();
            this.$image.on('remove_me',()=>this.removeDragImage());
            var off = this.d_offset;
            var p:Point = this.canvasView.localToGlobal(0,0);
            off.left+=p.x;
            off.top+=p.y;
            this.$image.offset(off).appendTo($cont);
            return this;
        }
        offset(o?:any):any{
            if(o) return this.$image.offset(o)
            else return this.$image.offset();
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
            this.image = img;

        }

    }

}