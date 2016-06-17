/**
 * Created by Администратор on 14.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>

interface JQuery {
    hammer ():JQuery;
};

module hallmark {
    import Point = createjs.Point;


    interface Iimage {
        p:Point;
        image:HTMLImageElement;
    }


    export class ImageDrag {
        private $image:JQuery;
        private startX:number;
        private startY:number;
        private currentX:number;
        private currentY:number;
        private $overlay:JQuery;
        trigger:JQuery = $({});
        private hammer:HammerManager;

        constructor(private $view:JQuery) {
            this.$overlay = $("#overlay");
        }

        addSwipes():void{
            var $img = this.$image;
            if(!$img) return;
            this.hammer = new Hammer($img.get(0));
            this.hammer.on("swiperight swipeleft", (evt) => {
                this.hammer.off("swiperight swipeleft");
                var x:number = $img.offset().left -100;
                if(evt.type == "swiperight") x += 200;
                $img.animate ({opacity: 0.1,left:x});
               setTimeout(()=> {
                   $img.remove();
                },1500);
            });
        }

        addDrag () {
            var $img = this.$image;
            if (!$img) return;
            this.reset();
            $(document).on("touchmove", (evt) => this.onMouseMove (evt));
            $(document).on("touchend touchcancel", (evt) => {
                $(document).off("touchmove touchend touchcancel");
                $img.on('touchstart',(evt)=>this.addDrag())
                this.addSwipes();
            });
        }
        dragOnCart () {
            var $img = this.$image;
            this.hammer.off("swiperight swipeleft");
            $(document).off("touchmove touchend touchcancel");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        }
        removeListeners():void{

        }

        reset () {
            this.startX =0;
            this.startY =0;
            this.mouseStartX =0;
            this.mouseStartY =0;
        }

        clear():void{
            this.reset();
            if(this.$image){
                var $im = this.$image;
                $im.animate ({opacity: 0.1}, 500,function () {
                    $im.remove();
                });

            }
        }

        private mouseStartX;
        private mouseStartY;

        onMouseMove (evt:any) {
            var $img = this.$image;
            if (!$img) return;
            var touch:Touch = evt.originalEvent.touches[0];
            if (this.mouseStartX == 0) {
                var offset = $img.offset();
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
            $img.offset({left: this.currentX, top: this.currentY});
            if (this.currentX < 100 && this.currentY > 360) {
                this.dragOnCart();
            }
        }

        setImage($img:JQuery) {
            this.clear();

            this.$overlay.append($img);
            var off = this.$view.offset();
            off.left+=$img.data('x');
            off.top+=$img.data('y');
            $img.offset(off);
            this.$image = $img;

            this.addDrag ();
         }
    }
}
