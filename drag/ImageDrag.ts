/**
 * Created by Администратор on 14.06.2016.
 */

///<reference path="../Gallery4.ts"/>

///<reference path="DragControl.ts"/>


module hallmark {
    import Point = createjs.Point;


    interface Iimage {
        p:Point;
        image:HTMLImageElement;
    }


    export class ImageDrag {
        model:ModelImage;
        private $overlay:JQuery;
        cartX:number;
        cartY:number;
        trigger:JQuery = $({});

        constructor() {
            this.$overlay = $("#overlay");
        }

      /*  folleowRectangle():void{
            var m:Matr = this.model.toGlobal();
            this.$testRec.width(m.w);
            this.$testRec.height(m.h);
            this.$testRec.offset({left:m.x,top:m.y});

           // this.$testRec.offset({left:m.x-(m.center.x*m.scale)+m.center.x,top:m.y-(m.center.y*m.scale)+m.center.y});

        }
*/
        static model:ModelImage;


        $testRec:JQuery = $('<div>').attr('id','TestRec');
        setImage(model:ModelImage) {
            if(this.model) this.model.image3D.removeDragImage();
            this.model = model;
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);

        }
    }
}
