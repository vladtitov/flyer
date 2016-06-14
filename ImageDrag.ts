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

    private hammerInit () {
        var $img = this.$image;
        $img.focus();
        var hammertime = new Hammer($img.get(0));
        var offset = $img.offset();
        this.startX = offset.left;
        this.startY = offset.top;
        hammertime.on("panmove", (event)=> {

            console.log("PAN");
            //_element.css({"left":this.startX+event.deltaX, "top":this.startY+event.deltaY});
            this.currentX = this.startX+event.deltaX;
            this.currentY = this.startY+event.deltaY;
            this.$image.offset({left:this.currentX, top:this.currentY})
        });
        hammertime.on("panend", (event)=> {
            this.startX = this.currentX;
            this.startY = this.currentY;
            /* startX = +_element.css("left").substring(0, _element.css("left").length-2) ;
             startY = +_element.css("top").substring(0, _element.css("top").length-2) ;*/
        });
    }

        setImage(img:Iimage) {
            this.$overlay.empty();
            var $img = $(img.image);
            this.$overlay.append($img);
            $img.attr("id","drag");
            var off = this.$view.offset();
            off.left+=img.p.x;
            off.top+=img.p.y;
            $img.offset(off);
            this.$image = $img;
            setTimeout( ()=>this.hammerInit(),200);
         }
    }
}
