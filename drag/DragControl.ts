/**
 * Created by Vlad on 6/24/2016.
 */
    ///<reference path="../Gallery4.ts"/>

module hallmark{
    export  class DragControl {

        private startX:number = 0;
        private startY:number = 0;
        private deltaX:number;
        private deltaY:number;

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

        onMove:Function;
        onMoveStart:Function;
        onMoveEnd:Function;

        onGestStop:Function;
        onGestStart:Function;
        onGest:Function;


        isMoving:boolean;
        isGestur:boolean;




        onCenterChanged:Function;




        prevX:number;
        prevY:number;


        private handleMove(x:number, y:number):void {
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

        }

        private stopMoving():void {
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

        }

        private handleGesture(x1:number, y1:number, x2:number, y2:number):void {
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


        ind:JQuery
        constructor(private el:HTMLElement) {

        }


        onOneTousch
       onTouchStart(evt:TouchEvent):void{
           var num = evt.touches;
           if( evt.touches.length==1){

           }
           //this.stop();
       }

        private onTouches0():void{
            this.startX=0;
            this.startY=0;
            this.startScale=0;
        }

        private calculateXY():{x:number,y:number}{
            if(this.length==0) return {x: this.touches[0].clientX,y:this.touches[0].clientY};
            else  return {x: this.touches[0].clientX,y:this.touches[0].clientY};
        }
        onTouchEnd(evt:TouchEvent):void{
            if(evt.touches.length==0)this.onTouches0();
        }


        onLengthChanged(num:number):void{
            this.length = num;
            this.startX=0;
            this.startScale=0;
        }

        onPanStart():void{

        }

        onpanEnd():void{

        }
        onPan(deltaX:number,deltaY:number){

        }

        private calculatePan():void{
            var xy = this.calculateXY();
            if(this.startX == 0){
                this.startX =xy.x;
                this.startY = xy.y;
                this.onPanStart();

             }else {
                this.deltaX = this.startX-xy.x;
                this.deltaY = this.startY-xy.y;
                this.onPan(this.deltaX ,this.deltaY);
            }

        }

        private calculateRotate():void{

        }

        private getDistance():number{
            var x1 = this.touches[0].clientX;
            var x2 = this.touches[1].clientX
            var y1 = this.touches[0].clientY;
            var y2 = this.touches[1].clientY;
            var dx = x2 - x1;
            var dy = y2 - y1;
          //  this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
         return dist;
        }
        onScaleStart():void{

        }
        onScale(num:number):void{

        }
        startScale:number=0;
        private calculatePinch():void{

            var dist:number =  this.getDistance();
            if(this.startScale===0){
                this.startScale = dist
                this.onScaleStart();
            }else{
                this.onScale(dist/this.startScale);
            }

        }

        private calculateMotions(){
            this.calculatePan();
            if(this.length ==2){
                this.calculateRotate();
                this.calculatePinch();
            }
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