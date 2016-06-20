/**
 * Created by Администратор on 15.06.2016.
 */

///<reference path="Gallery4.ts"/>


module hallmark {

    interface Events{
       [event:string]:Function[];

    }
import Container = createjs.Container;
        import Touch = createjs.Touch;



        export class TouchControler {

            trigger:JQuery = $({});
      //  private prev:number;
      //  private pressStart:number;
            private startX:number;
            private startY:number;
            private prevX:number;
            private prevY:number;
        private pointerid:number;
        isMove:boolean;
        speed:number;
            private events:Events = {};

      private clickTimer:number;


        //isHold:boolean;
          //  target

    constructor (private view:Container){
        this.init();
    }



            on(event:string,callBack:Function):TouchControler{
                if(!this.events[event])this.events[event] = [];
                this.events[event].push(callBack);
                return this;
            }

    init () {

        this.view.addEventListener('mousedown', (evt:any)=> {
            this.isMove = false;
          //  this.isHold = false;
            console.log('mousedowm');
            this.pointerid = evt.pointerID;
         //   this.prev = evt.stageY;
            this.startX = evt.stageX;
            this.startY = evt.stageY;
            this.prevX = this.startX;
            this.prevY = this.startY;
          //  this.pressStart = evt.stageY;
           // if (Math.abs(this.speed) > 5) this.pressStart = 0;
            clearTimeout(this.clickTimer);
            if (this.speed === 0) this.clickTimer = setTimeout(()=> {
                this.clickTimer = 0 ;
            }, 300);
            this.speed = 0;
        });

        this.view.addEventListener('pressup', (evt:any)=> {
            if(this.isMove) return;
            if( this.clickTimer !==0) this.onClick(evt);
          /*  var x:number = evt.startX;
            var y:number = evt.startY;
            if(Math.abs(this.startX-x)+Math.abs(this.startY-y)<6){

            }*/
           // if (this.isHold) return;
           // if(this.holdTimer !==0){
             //   clearTimeout(this.holdTimer);
               // this.holdTimer=0;
           // }

        //    if (this.pressStart !== 0 && Math.abs(this.pressStart - evt.stageY) < 6) {

                //if (ImagesColumn.onImageClick)ImagesColumn.onImageClick(evt.target)
         //   }
            this.pointerid = -1;
          //  var self = this;
           // if (Math.abs(this.speed) > 5) {
              //  this.isMove = true;
           // }
        });

        this.view.addEventListener('pressmove', (evt:any)=> {
          //  if (this.isHold) return;
            if (evt.pointerID !== this.pointerid) return;
            var nowY:number = evt.stageY;
            var nowX:number = evt.startX;
            var d:number = nowY - this.prevY;
            this.prevY = nowY;
            this.prevX = nowX;
            if(d!==0){
                this.speed = d;
                this.isMove = true;
                this.move(d);
            }
        });
    }

            onClick(evt:MouseEvent):void{
                if(this.events['click']) this.events['click'].forEach(function(callBack){
                    callBack(evt);
                })
            }

           /* private resetHold():void{
                if(this.holdTimer !==0){
                    clearTimeout(this.holdTimer);
                    this.holdTimer=0;
                }
            }*/
    public move (d:number) {

    }

    onPressHold (evt) {
     // this.trigger.triggerHandler(TouchControler.PRESS_HOLD,evt.target);

    }
}
}

