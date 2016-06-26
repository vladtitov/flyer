/**
 * Created by Vlad on 6/24/2016.
 */
    ///<reference path="../Gallery4.ts"/>

module hallmark{
    class Rec{
        x:number;
        y:number;
        w:number;
        h:number;
    }

    export interface IDragControl{
        start:Function;
        stop:Function;
        destroy:Function;
        on2touches:Function;
        on1touch:Function;
        onPanStart:Function;
        onPan:(deltaX:number,deltaY:number)=>void;
        onScaleStart:Function;
        onScale:(num:number)=>void;
        onCenterStart:(p:{x:number;y:number})=>void;
        onCenterChange:(dp:{dx:number;dy:number})=>void;
    }

    export  class DragControl implements IDragControl{

        private angleStart:number;
        private angleCurrent:number;
        private distanceStart:number;
        private distanceCurrent:number;
        private centerStart:{x:number;y:number};
        private centerCurrent:{x:number;y:number};
        private panStart:{x:number;y:number};
        private panCurrent:{x:number;y:number};


        private touches:TouchList;
        private length:number;


        constructor(private el:HTMLElement) {
                this.reset();
                this.start();
        }

        private reset():void{
            this.centerCurrent=null;
            this.centerStart=null;
            this.distanceStart=0;
            this.distanceCurrent=0;
            this.panStart=null;
            this.panCurrent=null
        }

        onTouchEnd(evt:TouchEvent):void{
            if(evt.touches.length==0)this.reset();
        }

        on2touches:Function
        on1touch:Function;

        onLengthChanged(num:number):void{
            this.length = num;
            this.reset();
            if(num===1 && this.on1touch) this.on1touch();
            else if(num===2 && this.on2touches) this.on2touches();
        }

        onPanStart:Function
        onPan:(deltaX:number,deltaY:number)=>void;

        private dispatchPan():void{
            if(!this.panStart){
                this.panStart= this.panCurrent;
                if(this.onPanStart)this.onPanStart();
             }else if(this.onPan) {
                var dx:number = this.panStart.x-this.panCurrent.x;
                var dy:number = this.panStart.y-this.panCurrent.y;
                this.onPan(dx,dy);
            }
        }

        private calculateTouches():void{
            var x1 = this.touches[0].clientX;
            var x2 = this.touches[1].clientX
            var y1 = this.touches[0].clientY;
            var y2 = this.touches[1].clientY;
            var dx = x2 - x1;
            var dy = y2 - y1;
            var a = Math.atan2(dy, dx) * 57.2957795;
            this.angleCurrent =  (a + 360) % 360;
            this.distanceCurrent =  Math.sqrt(dx * dx + dy * dy);
            this.centerCurrent = {x:(x2 + x1) / 2, y:(y1 + y2) / 2};
        }

        private calculatePan():void{
            this.panCurrent = {x:this.touches[0].clientX,y:this.touches[0].clientY}
        }

        onScaleStart:Function;
        onScale:(num:number)=>void;
        private dispatcheScale():void{
            if(this.distanceStart===0){
                this.distanceStart = this.distanceCurrent
               if(this.onScaleStart) this.onScaleStart();
            }else if(this.onScale){
                this.onScale(this.distanceCurrent/this.distanceStart);
            }

        }

        onCenterStart:(p:{x:number;y:number})=>void;
        onCenterChange:(dp:{dx:number;dy:number})=>void;

        private dispatchCenter():void{
            if(!this.centerStart){
                this.centerStart = this.centerCurrent;
                if( this.onCenterStart)this.onCenterStart(this.centerStart);
            }else if(this.onCenterChange){
                var dp:{dx:number;dy:number} = {
                    dx:this.centerCurrent.x-this.centerStart.x,
                    dy:this.centerCurrent.y-this.centerStart.y
                    }
                this.onCenterChange(dp);
            }
        }


        private onTouchMove(evt:TouchEvent) {
            evt.preventDefault();
            this.touches = evt.touches;
            var length = evt.touches.length;
            if(length==0) return;
            if(length>1)length = 2;
            if(this.length !== length) this.onLengthChanged(length);

            if(this.length==1){
                this.calculatePan();
                this.dispatchPan();
            }else{
                this.calculateTouches();
                this.dispatcheScale();
                this.dispatchCenter();
            }

        }
        
        destroy():void{
            this.stop();
            this.el=null;
        }


        listeners:any={};

        start():void{
          /*  var onTouchStart = (evt:TouchEvent)=>this.onTouchStart(evt);
            this.el.addEventListener('touchstart',onTouchStart);
            this.listeners['touchstart'] = onTouchStart;
            var onTouchEnd = (evt:TouchEvent)=>this.onTouchEnd(evt);
            this.listeners['touchend'] = onTouchEnd;*/
            var onTouchEnd = (evt:TouchEvent)=>this.onTouchEnd(evt);
            this.el.addEventListener('touchend',onTouchEnd);
            this.listeners['touchend'] = onTouchEnd;
            var onTouchMove = (evt:TouchEvent)=>this.onTouchMove(evt);
            this.listeners['touchmove'] = onTouchMove;
            this.el.addEventListener('touchmove',onTouchMove);

        }
        stop():void{
            this.el.removeEventListener('touchmove', this.listeners['touchmove']);
            this.el.removeEventListener('touchend', this.listeners['touchend']);
        }

    }

}