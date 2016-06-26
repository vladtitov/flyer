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
        private $overlay:JQuery;
        cartX:number;
        cartY:number;
        trigger:JQuery = $({});

        constructor() {
            this.$overlay = $("#overlay");
        }

      /*  reqAnimationFrame (callBack:Function) {
            /!*return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };*!/
            requestAnimationFrame ( () => callBack ());
        };

*/
        on1Touch():void{
            this.dragControl.onPanStart = ()=>{
                this.startP = this.model.getOffset();
            }
            this.dragControl.onPan = (dx:number,dy:number)=>{
                this.model.setOffset(this.startP.x-dx,this.startP.y-dy);
                //this.folleowRectangle();;
            }

            this.dragControl.onScaleStart = null;
            this.dragControl.onScale = null;
            this.dragControl.onCenterStart = null;
            this.dragControl.onCenterChange = null;
        }

        on2Touches():void{
            this.dragControl.onPanStart = null;
            this.dragControl.onPan = null;

            this.dragControl.onScaleStart = ()=>{
                this.startScale = this.model.getScale();
            }
            this.dragControl.onScale = (k:number)=>{
                this.model.setScale(this.startScale*k);
               // this.folleowRectangle();

            }
            this.dragControl.onCenterStart = (p:{x:number;y:number})=>{
                this.centerStart = this.model.getCenter();
                var m:Matr = this.model.toGlobal();
                var x:number = (p.x-m.x)/m.scale;
                var y:number =  (p.y-m.y)/m.scale;
                this.model.setCenter(x,y);
            }

            this.dragControl.onCenterChange = (dp:{dx:number,dy:number})=>{

              /*  if(this.centerStart){
                    var p:{x:number;y:number} = {
                        x:this.centerStart.x - dp.dx,
                        y:this.centerStart.y - dp.dy
                    }
                    this.model.setCenter(p);
                    this.centerStart = null;
                }
*/
            }

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


        centerStart:{x:number;y:number};
        dragControl:DragControl

        startP:{x:number,y:number};

        startScale:number;
        $testRec:JQuery = $('<div>').attr('id','TestRec');
        setImage(model:ModelImage) {
            if(this.model) this.model.removeDragImage();

            //model.setDefaultOffcet(this.$view.offset());
            this.model = model;
            this.model.resetElement();
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
            if(this.dragControl)this.dragControl.destroy();
            this.dragControl = new DragControl(model.imageClone);

            this.dragControl.on1touch = ()=>this.on1Touch();
            this.dragControl.on2touches =()=>this.on2Touches();

        }
    }
}
