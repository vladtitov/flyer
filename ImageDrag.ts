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

        constructor(private $view:JQuery) {
            this.$overlay = $("#overlay");
        }

        addDrag () {
            var $img = this.$image;
            if (!$img) return;
            $(document).on("touchmove", (evt) => this.onMouseMove (evt));
            $img.hammer().on("swiperight swipeleft", (evt) => {
                this.removeDrag ();
                console.log(evt.type);
                if (evt.type == "swipeleft") $img.animate ({opacity: 0.1, left:0}, 1000);
                if (evt.type == "swiperight") $img.animate ({opacity: 0.1, left:320}, 1000);
                $img.hammer().off("swiperight swipeleft");
                setTimeout(()=> {
                    $img.remove();
                },1500);
            });
        }

        removeDrag () {
            $(document).off("touchmove");
        }

        dragOnCart () {
            var $img = this.$image;
            $img.hammer().off("swiperight swipeleft");
            this.trigger.triggerHandler("DRAG_ON_CART", $img);
            this.reset();
        }

        reset () {
            this.$image=null;
            this.startX =0;
            this.startY =0;
            this.mouseStartX =0;
            this.mouseStartY =0;
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
                this.removeDrag();
                this.dragOnCart();
            }
        }

        setImage(img:Iimage) {
            this.reset();
            var $img = $(img.image).clone();
            this.$overlay.empty();
            this.$overlay.append($img);
            var off = this.$view.offset();
            off.left+=img.p.x;
            off.top+=img.p.y;
            $img.offset(off);
            this.$image = $img;
            this.addDrag ();
         }
    }
}
