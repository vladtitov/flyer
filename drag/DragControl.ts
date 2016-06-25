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
    export  class DragControl {
        private active:boolean;
        private startDist:number;
        private startAng:number;

        zoom:number = 0;
        angle:number = 0;
        DX:number = 0;
        DY:number = 0;
        moveSpeed:number=0;
        //  moveSpeed5:number=0;
        //   count5:number;
        //  accum5:number;

        centerX:number = 0;
        centerY:number = 0;

       /* onMove:Function;
        onMoveStart:Function;
        onMoveEnd:Function;

        onGestStop:Function;
        onGestStart:Function;
        onGest:Function;


        isMoving:boolean;
        isGestur:boolean;
*/



        onCenterChanged:Function;




        prevX:number;
        prevY:number;


       /* private handleMove(x:number, y:number):void {
            if (this.isGestur){
                this.stopGestures();
                return;
            }
            if (!this.isMoving) {
                this.isMoving = true;
                this.startX = x;
                this.startY = y;
                this.DX = 0;
                this.DY = 0;
                this.prevX=x;
                this.prevY=y;
                if(this.ind){
                    $('#Move').show();
                    /// $('#Move').fadeOut('fast',()=>{$('#Move').fadeIn()});
                }
                if (this.onMoveStart)this.onMoveStart();

            } else {

                this.DX = x - this.startX;
                this.DY = y - this.startY;
                if(this.ind){
                    this.ind.css({left:this.DX,top:this.DY})
                }
                var dx = x - this.prevX;
                var dy = y - this.prevY;
                this.moveSpeed=Math.sqrt(dx*dx+dy*dy);
                this.prevX=x;
                this.prevY=y;

                if (this.onMove)this.onMove(this.DX, this.DY);
            }


            //// console.log(this.moveX+'  '+this.moveY);

        }*/

        /*private stopMoving():void {
            $('#Move').hide();
            this.isMoving = false;
            if (this.onMoveEnd)this.onMoveEnd();
        }

        private stopGestures():void {
            $('#Gestur').hide();
            this.isGestur = false;
            if (this.onGestStop) this.onGestStop();
        }

        private setCenter(x:number, y:number) {
            // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX = x;
            this.centerY = y;
            //}

        }*/

     /*   private handleGesture(x1:number, y1:number, x2:number, y2:number):void {
            if (this.isMoving) {
                this.stopMoving();
                return;
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var a = Math.atan2(dy, dx) * 57.2957795;
            var ang =  (a + 360) % 360;// (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)

            if (!this.isGestur) {
                this.startDist = dist;
                this.startAng = ang;
                this.isGestur = true;
                this.angle = 0;
                this.zoom = 0;
                if(this.ind){
                    $('#Gestur').show();
                    //  $('#Gestur').fadeOut('fast',()=>{$('#Gestur').fadeIn()});

                }

                if(this.onGestStart)this.onGestStart();
            } else {
                this.zoom = dist - this.startDist;
                this.angle = ang - this.startAng;
                var sc = dist/this.startDist

                if(this.ind){
                    this.ind.css('transform','scale('+sc+') rotate('+this.angle+'deg)');
                }

                if (this.onGest)this.onGest(this.zoom, this.angle);
            }


        }
*/

        ind:JQuery
        constructor(private el:HTMLElement) {
                this.reset();
        }


        onOneTousch
       onTouchStart(evt:TouchEvent):void{
           var num = evt.touches;
           if( evt.touches.length==1){

           }
           //this.stop();
       }

        private reset():void{
            this.centerCurrent=null;
            this.centerStart=null;
            this.distanceStart=0;
            this.distanceCurrent=0;
           this.panStart=null;
            this.panCurrent=null
        }

      /*  private calculateXY():{x:number,y:number}{
            if(this.length==0) return {x: this.touches[0].clientX,y:this.touches[0].clientY};
            else  return {x: this.touches[0].clientX,y:this.touches[0].clientY};
        }*/
        onTouchEnd(evt:TouchEvent):void{
            if(evt.touches.length==0)this.reset();
        }


        on2touches():void{

        }
        on1touch():void{

        }
        onLengthChanged(num:number):void{
            this.length = num;
            this.reset();
            if(num===1)this.on1touch();
            else this.on2touches()

        }

        onPanStart():void{

        }

        onpanEnd():void{

        }
        onPan(deltaX:number,deltaY:number){

        }

        private dispatchPan():void{
            if(!this.panStart){
                this.panStart= this.panCurrent;
                this.onPanStart();

             }else {
                var dx:number = this.panStart.x-this.panCurrent.x;
                var dy:number = this.panStart.y-this.panCurrent.y;
                this.onPan(dx,dy);
            }

        }

        private calculateRotate():void{

        }

        private angleStart:number;
        private angleCurrent:number;
        private distanceStart:number;
        private distanceCurrent:number;
        private centerStart:{x:number;y:number};
        private centerCurrent:{x:number;y:number};
       private panStart:{x:number;y:number};
       private panCurrent:{x:number;y:number};



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

        calculateOneTouch():void{
            this.panCurrent = {x:this.touches[0].clientX,y:this.touches[0].clientY}
        }


        onScaleStart:Function;
        onScale(num:number):void{

        }

        private dispatcheScale():void{
            if(this.distanceStart===0){
                this.distanceStart = this.distanceCurrent
                this.onScaleStart();
            }else{

                this.onScale(this.distanceCurrent/this.distanceStart);
            }

        }

        onCenterStart:(p:{x:number;y:number})=>void;



        onCenterChange(dp:{dx:number;dy:number}){

        }

        private getBoundaries():Rec{
            var rec:Rec = new Rec();
            rec.x= this.el.offsetLeft;
            rec.y=this.el.offsetTop;
            rec.w=this.el.offsetWidth;
            rec.h=this.el.offsetHeight;
            return rec;

        }

       

        private dispatchCenter():void{
            if(!this.centerStart){
                this.centerStart = this.centerCurrent;
                this.onCenterStart(this.centerStart);
            }else{
                var dp:{dx:number;dy:number} = {
                    dx:this.centerCurrent.x-this.centerStart.x,
                    dy:this.centerCurrent.y-this.centerStart.y
                    }
                this.onCenterChange(dp);
            }
        }

        private calculateMotions(){
            if(this.length ==2) this.calculateTouches();
            else this.calculateOneTouch();
        }


        private touches:TouchList;
        private length:number;

        private onTouchMove(evt:TouchEvent) {
            evt.preventDefault();

            this.touches = evt.touches;
            var length = evt.touches.length

          //  console.log(length);
            if(length>1)length = 2;
            if(this.length !== length) this.onLengthChanged(length);
            this.calculateMotions();
            if(this.length==1){
                if(this.onPanStart)this.dispatchPan();
            }else{
                if(this.onScaleStart)this.dispatcheScale();
                if(this.onCenterStart)this.dispatchCenter();
            }



           // if (evt.touches.length == 1)this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
           // else if (evt.touches.length == 2)this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);

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
          //  this.el.removeEventListener('touchstart', this.listeners['touchstart']);
        }
        setTimedInterval(callback, delay, timeout,onEnd){
            var id=window.setInterval(callback, delay);
            window.setTimeout(function(){
                window.clearInterval(id);
                onEnd()
            }, timeout);
        }


       /* private onTouchEnd():void {
            if (this.isMoving) this.stopMoving();
            if (this.isGestur)this.stopGestures();
        }*/

       /* private addListeners(evt):void {
            var that = this;
            var onTouchMove = function (evt) {
                that.onTouchMove(evt);
            }

            var onTouchEnd = function (evt) {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('touchcancel', onTouchEnd);
                that.onTouchEnd();
            }

            this.active = true;
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', onTouchEnd);
        }*/
    }

}