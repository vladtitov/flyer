/**
 * Created by Администратор on 15.06.2016.
 */

///<reference path="Gallery4.ts"/>


module hallmark {

import Container = createjs.Container;
        import Touch = createjs.Touch;



        export class TouchControler {

            trigger:JQuery = $({});
        private prev:number;
        private pressStart:number;
        private pointerid:number;
        isMove:boolean;
        speed:number;
        private holdTimer:number;
        static PRESS_HOLD:string = "PRESS_HOLD";
        isHold:boolean;
            target

    constructor (private view:Container){
        this.init();
    }

    init () {
        this.view.addEventListener('mousedown', (evt:any)=> {
            this.isMove = false;
            this.isHold = false;
            console.log('mousedowm');
            this.pointerid = evt.pointerID;
            this.prev = evt.stageY;
            this.pressStart = evt.stageY;
            if (Math.abs(this.speed) > 5) this.pressStart = 0;
            this.speed = 0;
            clearTimeout(this.holdTimer);
            this.holdTimer = setTimeout(()=> {
                this.isHold = true;
                this.onPressHold(evt);
            }, 1000);
        });

        this.view.addEventListener('pressup', (evt:any)=> {
            if (this.isHold) return;
            if(this.holdTimer !==0){
                clearTimeout(this.holdTimer);
                this.holdTimer=0;
            }
            if (this.pressStart !== 0 && Math.abs(this.pressStart - evt.stageY) < 6) {
                //if (ImagesColumn.onImageClick)ImagesColumn.onImageClick(evt.target)
            }
            this.pointerid = -1;
            var self = this;
            if (Math.abs(this.speed) > 5) {
                this.isMove = true;
            }
        });

        this.view.addEventListener('pressmove', (evt:any)=> {
            if (this.isHold) return;
            if (evt.pointerID !== this.pointerid) return;
            var now:number = evt.stageY;
            var d:number = now - this.prev;
            this.prev = now;
            if(d!==0){
                this.resetHold();
                this.move(d);
            }
        });
    }


            private resetHold():void{
                if(this.holdTimer !==0){
                    clearTimeout(this.holdTimer);
                    this.holdTimer=0;
                }
            }
    public move (d:number) {

    }

    onPressHold (evt) {
      this.trigger.triggerHandler(TouchControler.PRESS_HOLD,evt.target);

    }
}
}

