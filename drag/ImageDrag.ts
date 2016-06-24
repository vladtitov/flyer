/**
 * Created by Администратор on 14.06.2016.
 */

///<reference path="../Gallery4.ts"/>


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

        hammerStart () {
            if (this.model) {
                this.img = this.model.imageClone;
                this.$image = this.model.$image;
            } else return;

            this.mc = new Hammer.Manager(this.$image.get(0));

            this.mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));

            this.mc.add(new Hammer.Swipe()).recognizeWith( this.mc.get('pan'));
            this.mc.add(new Hammer.Rotate({threshold: 0})).recognizeWith( this.mc.get('pan'));
            this.mc.add(new Hammer.Pinch({threshold: 0})).recognizeWith(this.mc.get('pan'));

            this.mc.on("panmove", (evt) => this.onPan(evt));
            this.mc.on("panstart", (evt) => this.onPanStart(evt));
            this.mc.on("panend", (evt) => this.onPanEnd(evt));

            this.mc.on("pinchmove", (evt) => this.onPinch(evt));
            this.mc.on("pinchstart", (evt) => this.onPinchStart(evt));
            this.mc.on("pinchend", (evt) => this.onPinchEnd(evt));

            this.mc.on("rotatestart", (evt) => this.onRotateStart (evt));
            this.mc.on("rotatemove", (evt) => this.onRotate (evt));
            this.mc.on("rotateend", (evt) => this.onRotateEnd (evt));
            //this.mc.on("pinchend rotatenend", (evt) => this.onPinchRotate(evt));

            this.mc.on("hammer.input", (ev)=> {
                if (ev.isFinal) {

                }
            });
        }
/////////////////////////////////////////////////
        onRotateStart(evt:HammerInput):void{

        }
        onRotateEnd(evt:HammerInput):void{

        }
        onRotate(ev:HammerInput):void {
            //this.mc.off("pinchstart pinchmove");
           // console.log(this.model.getAngle() + ev.rotation);
           // this.model.setAngle (this.model.getAngle() + ev.rotation);
           // this.requestElementUpdate();
        }
/////////////////////////////
        private startScale:number;
        onPinchStart(evt:HammerInput):void{
            this.startScale = evt.scale;
            console.log('start scale '+this.startScale);
        }
        
        onPinchEnd(evt:HammerInput):void{

        }

        onPinch(ev:HammerInput):void {

            //this.mc.off("rotatestart rotatemove");
            var scale = this.startScale*ev.scale;
            console.log('onPinch '+scale);
           // var scale = Math.max( 1, Math.min((this.model.getScale() * ev.scale), 3));
            //console.log(scale);
           // this.model.setScale (scale);
            this.requestElementUpdate();
        }


        ////////////////////////////////////////////////////////////////////
        hammerEnd ():void {
            this.mc.destroy();
            this.mc = null;
        }

        updateElementTransform():void {
            this.ticking = false;
            this.model.renderTransform();
        }

        requestElementUpdate():void {
           if(!this.ticking) {
                this.reqAnimationFrame ( () => this.updateElementTransform ());
                this.ticking = true;
           }
        }

        onPanStart (ev:HammerInput):void {
            var offset = this.model.getOffset();
            this.startX = offset.x;
            this.startY = offset.y;
           // this.removeSwipes();
        }

        onPan(ev:HammerInput):void {
            this.currentX = this.startX + ev.deltaX;
            this.currentY = this.startY + ev.deltaY;
            this.model.setOffset(this.currentX, this.currentY);
            if (this.currentX < this.cartX && this.currentY > this.cartY) this.trigger.triggerHandler('ON_CART')
            else this.requestElementUpdate();
        }

        onPanEnd(ev:HammerInput):void {
           // this.addSwipes();
        }



        /*onPinchRotate(ev:HammerInput):void {
            this.mc.on("rotatestart rotatemove");
            this.mc.on("pinchstart pinchmove");
        }*/

        onSwipeRightLeft(ev:HammerInput) {
            var x:number = this.$image.offset().left -100;
            if(ev.type == "swiperight") x += 200;
            this.$image.animate ({left:x});
            this.model.removeDragImage();
            this.reset();
            this.shopingCart.toggleOn();
        }

        addSwipes():void{
            this.mc.on("swiperight swipeleft", (evt) => this.onSwipeRightLeft(evt));
        }

        removeSwipes():void{
            this.mc.off("swiperight swipeleft");
        }

        dragOnCart () {
            this.trigger.triggerHandler("DRAG_ON_CART", this.model);
            this.shopingCart.toggleOn();
            this.reset();
        }

        removeDrag () {
            $(document).off("touchmove");
        }



        private resetXY () {
            this.startX =0;
            this.startY =0;
            this.mouseStartX =0;
            this.mouseStartY =0;
        }
        
        reset():void{
            this.model = null;
            this.resetXY();
            if(this.mc){
               this.hammerEnd ();
            }
            $(document).off("touchmove touchend touchcancel");
        }

        setImage(model:ModelImage) {
            if(this.model) this.model.removeDragImage();
            this.reset();
            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.model.resetElement();
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.model.renderTransform();
            this.hammerStart();
            this.addSwipes();
        }
    }
}
