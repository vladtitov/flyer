/**
 * Created by Администратор on 14.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>


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
        constructor(private $view:JQuery) {
            this.$overlay = $("#overlay");
    }

    /*private hammerInit () {
        var $img = this.$image;
        var hammertime = new Hammer.Manager($img.get(0));
        hammertime.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

        var offset = $img.offset();
        this.startX = offset.left;
        this.startY = offset.top;
        hammertime.on("panmove", (event)=> {
            this.currentX = this.startX+event.deltaX;
            this.currentY = this.startY+event.deltaY;
            $img.offset({left:this.currentX, top:this.currentY});
            if (this.currentX<100 && this.currentY>380 ) {
                hammertime.add(new Hammer.Pan({enable: false}));
                $img.animate ({opacity: 0.1, left:20, top: 450}, 2000);
                setTimeout(()=> {
                    $img.css ("opacity", "1");
                    $img.css ("position", "static");
                    if ($(".item:nth-child(3)").html() == '') $(".item:nth-child(3)").append($img);
                    if ($(".item:nth-child(2)").html() == '') $(".item:nth-child(2)").append($img);
                    if ($(".item:nth-child(1)").html() == '') $(".item:nth-child(1)").append($img);
                    $img.animate ({opacity: 1}, 1000);
                    this.$overlay.empty();
                    $('#shopcartitems').css("display","block");
                },2000);
            }
        });

        hammertime.on("panend", (event)=> {
            this.startX = this.currentX;
            this.startY = this.currentY;
        });
        hammertime.on("swipeleft swiperight", (event)=> {
            this.$overlay.empty();
        });
    }*/

        addDrag ($img) {
            $(document).on("touchmove", (evt) => this.onMouseMove (evt, $img))
            $img.on("swiperight swipeleft", (evt) => {
                this.removeDrag ();
                if (evt.type == "swipeleft") $img.animate ({opacity: 0.1, left:0}, 1000);
                if (evt.type == "swiperight") $img.animate ({opacity: 0.1, left:320}, 1000);
                $img.animate ({opacity: 1}, 5);
                setTimeout(()=> {
                    this.reset ();
                },1005);
            });
        }

        removeDrag () {
            $(document).off("touchmove");
        }

        dragOnCart ($img) {
             if (this.currentX<100 && this.currentY>360 ) {
                 this.removeDrag ();
                 $img.animate ({opacity: 0.1, left:20, top: 450}, 1000);
                 setTimeout(()=> {
                     $img.css ("position", "static");
                     $img.appendTo('#shopcartitems');
                     $img.addClass("item");
                     $img.animate ({opacity: 1}, 1000);
                     $('#shopcartitems').css("display","block");
                     $img.on("swipe", (evt) => {
                         $img.remove();
                         $img.off("swipe");
                     });
                     this.reset ();
                     },1000);
             }
        }

        reset () {
            this.$overlay.empty();
        }

        private mouseStartX;
        private mouseStartY;

        onMouseMove (evt:any, $img) {
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
            $img.offset({left:this.currentX, top:this.currentY});
            this.dragOnCart($img);
        }

        setImage(img:Iimage) {
            this.reset ();
            var $img = $(img.image);
            this.$overlay.append($img);
            var off = this.$view.offset();
            off.left+=img.p.x;
            off.top+=img.p.y;
            $img.offset(off);
            this.$image = $img;
            this.startX =0;
            this.startY =0;
            this.mouseStartX =0;
            this.mouseStartY =0;
            this.addDrag ($img);
         }
    }
}
