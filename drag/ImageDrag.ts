/**
 * Created by Администратор on 14.06.2016.
 */

///<reference path="../Gallery4.ts"/>

///<reference path="DragControl.ts"/>

interface JQuery {
    hammer ():JQuery;
}

module hallmark {
    import Point = createjs.Point;


    interface Iimage {
        p:Point;
        image:HTMLImageElement;
    }


    export class ImageDrag {
        model:ModelImage;
        private startX:number;
        private startY:number;
        private mouseStartX:number;
        private mouseStartY:number;
        private currentX:number;
        private currentY:number;
        private $overlay:JQuery;
        private ticking:boolean = false;
        transform:{scale: number; angle: number};
        private timer:number;
        private mc:HammerManager;
        private img:HTMLElement;
        private $image:JQuery;
        cartX:number;
        cartY:number;
        trigger:JQuery = $({});
        shopingCart:ShopingCart;


        constructor() {
            this.$overlay = $("#overlay");
        }

        reqAnimationFrame (callBack:Function) {
            /*return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };*/
            requestAnimationFrame ( () => callBack ());
        };




        dragControl:DragControl

        startP:{x:number,y:number};

        startScale:number;
        setImage(model:ModelImage) {
            if(this.model) this.model.removeDragImage();

            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.model.resetElement();
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.model.renderTransform();
            this.dragControl = new DragControl(model.imageClone);
            this.dragControl.start();
            this.dragControl.onPanStart = ()=>{
               this.startP = this.model.getOffset();
            }
            this.dragControl.onPan = (dx:number,dy:number)=>{
                this.model.setOffset(this.startP.x-dx,this.startP.y-dy);
            }

            this.dragControl.onScaleStart = ()=>{
                this.startScale = this.model.getScale();
            }
            this.dragControl.onScale = (k:number)=>{
                this.model.setScale(this.startScale*k);
            }
        }
    }
}
