/**
 * Created by Администратор on 14.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>
///<reference path="ModelImage.ts"/>
///<reference path="ShopingCart.ts"/>


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
        private mouseStartX;
        private mouseStartY;
        private currentX:number;
        private currentY:number;
        private $overlay:JQuery;
        cartX:number;
        cartY:number;
        trigger:JQuery = $({});
        shopingCart:ShopingCart;

        private hammer:HammerManager;

        constructor() {
            this.$overlay = $("#overlay");
        }

        addSwipes():void{
            if (!this.model) return;
            var $img = this.model.$image;

            this.hammer = new Hammer($img.get(0));
            this.hammer.on("swiperight swipeleft", (evt) => {

                this.hammer.off("swiperight swipeleft");
                this.hammer.off("pinch rotate");
                this.model.setScale(1);
                var x:number = $img.offset().left -100;
                if(evt.type == "swiperight") x += 200;
                $img.animate ({left:x});
                this.model.removeDragImage();
                this.reset();
                this.shopingCart.toggleView();
            });
        }

        addScaleRotate():void {
            if (!this.model) return;
            var $img = this.model.$image;

            this.hammer = new Hammer($img.get(0));

            var pinch = new Hammer.Pinch();
            var rotate = new Hammer.Rotate();

            pinch.recognizeWith(rotate);

            this.hammer.add([pinch, rotate]);

            this.hammer.on("pinch rotate", (evt) => {
                var curScale:number = this.model.getScale();
                var scale = Math.max (1, Math.min (curScale * evt.scale, 3));
                this.model.setScale(scale);
                var curRotation:number = this.model.getRotation();
                var rotation = curRotation + evt.rotation;
                this.model.setRotation(rotation);
            });
        }

        addDrag () {
            if (!this.model) return;
            this.resetXY();
            var $img = this.model.$image;
            $(document).on("touchmove", (evt) => this.onMouseMove (evt));
            this.addScaleRotate ();
            $(document).on("touchend touchcancel", (evt) => {
                $(document).off("touchmove touchend touchcancel");
                $img.on('touchstart',(evt)=>this.addDrag());
                this.addSwipes();
            });
        }

        /*dragOnCart () {
            var $img = this.model.$image;
            this.hammer.off("swiperight swipeleft");
            $(document).off("touchmove touchend touchcancel");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        }*/

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
            if(this.hammer){
                this.hammer.off("swiperight swipeleft");

            }
            $(document).off("touchmove touchend touchcancel");
        }


        onMouseMove (evt:any) {
            if (!this.model) return;
            var $img = this.model.$image;
            var touch:Touch = evt.originalEvent.touches[0];
            if (this.mouseStartX == 0) {
                var offset = this.model.getOffset();
                this.startX = offset.left;
                this.startY = offset.top;
                this.mouseStartX = touch.clientX;
                this.mouseStartY = touch.clientY;
                return;
            }
            
            var dX = touch.clientX - this.mouseStartX;
            var dY = touch.clientY - this.mouseStartY;
            this.currentX = this.startX + dX;
            this.currentY = this.startY + dY;
            this.model.setOffset({left: this.currentX, top: this.currentY});
           // $img.offset();
            //if (this.currentX < this.cartX && this.currentY > this.cartY) this.trigger.triggerHandler('ON_CART');

        }

        setImage(model:ModelImage) {
            if(this.model) this.model.removeDragImage();
            this.reset();
            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            this.addDrag ();
         }
    }
}
