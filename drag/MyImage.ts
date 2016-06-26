/**
 * Created by Vlad on 6/25/2016.
 */
    ///<reference path="../Gallery4.ts"/>
module hallmark{

    export interface P{
        x:number;
        y:number;
    }
    export interface Matr{
        x:number;
        y:number;
        w:number;
        h:number;
        center:P;
        scale:number;
    }

    export class Image3D{

        $image:JQuery
        image:HTMLImageElement;
        private isCenter:boolean;
        private ticking:boolean;
        private centerCurrent:P={x:50,y:50};
        private transformType:string = "transform";
        private dragControl:DragControl;

        width:number =100;
        height:number=100;

        private  transform : {translate: {x: number; y:number};
            scale: number;
            angle: number;
            rx: number;
            ry: number;
            rz: number;
        };
        constructor(url:string){
            this.$image = $('<img>').attr('src',url);
            this.image = this.$image.get(0);
            this.$image.on('remove_me',()=>this.removeDragImage());
            this.resetElement();
        }

        createDragControl():void{
            this.dragControl = new DragControl(this.image);
            this.dragControl.on1touch = ()=>this.on1Touch();
            this.dragControl.on2touches =()=>this.on2Touches();

        }

        //////////////////////////////////////////////
        private startP:{x:number,y:number};
        private startScale:number;
        private centerStart:{x:number;y:number};
        private  on1Touch():void{
            this.dragControl.onPanStart = ()=>{
                this.startP = this.getOffset();
            }
            this.dragControl.onPan = (dx:number,dy:number)=>{
                this.setOffset(this.startP.x-dx,this.startP.y-dy);
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
                this.startScale = this.getScale();
            }
            this.dragControl.onScale = (k:number)=>{
                this.setScale(this.startScale*k);
                // this.folleowRectangle();

            }
            this.dragControl.onCenterStart = (p:{x:number;y:number})=>{
                this.centerStart = this.getCenter();
                var m:Matr = this.toGlobal();
                var x:number = (p.x-m.x)/m.scale;
                var y:number =  (p.y-m.y)/m.scale;
                this.setCenter(x,y);
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


//////////////////////////////////////////////////////////////


        setScale (scale:number) {
            this.transform.scale = scale;
            this.requestElementUpdate();
        }

        setAngle (angle:number) {
            this.transform.angle = angle;
            this.requestElementUpdate();
        }

        getScale ():number {
            return this.transform.scale;
        }

        getAngle ():number {
            return this.transform.angle;
        }
        getCenter():P{
            return this.centerCurrent;
        }
        setCenter(x:number,y:number):void{
            var dx:number = x-this.centerCurrent.x;
            var dy:number = y-this.centerCurrent.y;
            this.transform.translate.x+=(dx*this.transform.scale)-dx;
            this.transform.translate.y+=(dy*this.transform.scale) - dy;
            this.centerCurrent.x=x;
            this.centerCurrent.y=y;
            this.isCenter = true;
            this.requestElementUpdate();
        }

        setOffset(x:number, y:number) {
            this.transform.translate.x = x;
            this.transform.translate.y = y;
            this.requestElementUpdate();
        }

        getOffset (): P{
            return {x:this.transform.translate.x, y: this.transform.translate.y};
        }

        toGlobal():Matr{
            //m.x-(m.center.x*m.scale)+m.center.x
            return {
                x:this.transform.translate.x-(this.centerCurrent.x*this.transform.scale)+this.centerCurrent.x,
                y:this.transform.translate.y-(this.centerCurrent.y*this.transform.scale)+this.centerCurrent.y,
                w:this.width*this.transform.scale,
                h:this.height*this.transform.scale,
                scale:this.transform.scale,
                center:this.centerCurrent
            }

        }

        resetElement ():Image3D {
            this.transform = {translate: {x:0, y:0},
                scale: 1,
                angle: 0,
                rx: 0,
                ry: 0,
                rz: 0
            };
            return this;
        }

        requestElementUpdate():void {
            if(!this.ticking) {
                this.reqAnimationFrame ( () => this.updateElementTransform ());
                this.ticking = true;
            }
        }

        updateElementTransform():void {
            this.ticking = false;
            this.renderTransform();
        }
        reqAnimationFrame (callBack:Function) {
            /*return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
             window.setTimeout(callback, 1000 / 60);
             };*/
            requestAnimationFrame ( () => callBack ());
        };

        renderTransform () {
            if(this.isCenter){
                this.image.style.transformOrigin = this.centerCurrent.x+'px '+this.centerCurrent.y+'px';
                this.isCenter = false;
            }
            var value_array:string [] = [
                'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
                'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
                'rotate3d('+ this.transform.rx +','+ this.transform.ry +','+ this.transform.rz +','+  this.transform.angle + 'deg)'
            ];

            var value:string = value_array.join(" ");
            this.image.style.webkitTransform = value;

            //this.image.style.mozTransform = value;
            //this.image.style[this.transformType] = value;

        }
        destroy():void{

        }
        appendTo($cont:JQuery):void{
            this.$image.appendTo($cont);
        }
        removeDragImage():void{
            var $img:JQuery = this.$image;
            $img.fadeOut('slow',function () { $img.remove(); });
            this.destroy();
        }


    }

}