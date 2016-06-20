/**
 * Created by VladHome on 1/29/2016.
 */
    ///<reference path="typings/jquery.d.ts"/>
/// <reference path="typings/tweenjs.d.ts" />
/// <reference path="typings/easeljs.d.ts" />
    ///<reference path="Gallery4.ts"/>
    ///<reference path="ModelImage.ts"/>

module hallmark {
    import Bitmap = createjs.Bitmap;
    import SpriteContainer = createjs.SpriteContainer;
    //import Data = google.maps.Data;

    import Stage = createjs.Stage;
    import DisplayObject = createjs.DisplayObject;
    import MouseEvent = createjs.MouseEvent;
    import Container = createjs.Container;
    import Rectangle = createjs.Rectangle;


    export class CollectionImages {
        //static onImageLoaded:Function;
        static trigger:JQuery = $({});
        data:ModelImage[];
        private price1:Bitmap;
        private price2:Bitmap;
        GOT_50:string ='GOT_50';
       trigger:JQuery = $({});

        constructor(private options:any){       
            ModelImage.thumbSize = this.options.thumbSize;
            var count=0;
            ModelImage.trigger.on(ModelImage.IMAGE_LOADED,()=>{
                if(count++ === 51) {
                    this.trigger.trigger(this.GOT_50);
                    ModelImage.trigger.off(ModelImage.IMAGE_LOADED);
                }
            })
            this.loadData(options.server+options.getimages);
        }
  
        private loadData(url:string):void{
            $.get(url).done((res)=>{
                //this.images.resolve(res);
                var out:ModelImage[]=[];
                for (var i = 0, n = res.length; i < n; i++) {
                    var image = new ModelImage(res[i]);
                    out.push(image);
                }
                this.data = out;
            })
        }
        

        getPrice1():Bitmap{
            return this.price1.clone();
        }
        getPrice2():Bitmap{
            return this.price2.clone();
        }
        createPrices():void{
            this.price1 = new Bitmap('media/assets/price1.png');
            this.price2 = new Bitmap('media/assets/price2.png');
        }
      //  private images:DisplayObject[] = [];
        current:number = 0;

       /* getImageByReference(DO:DisplayObject):ModelImage{
            if(DO.name=='bmp' || DO.name=='shape'){
                return this.images[DO.parent.name];
            }
            return null;
        }*/
        /*addImages(num:number, ar:DisplayObject[]):void {
            this.images = this.images.concat(ar);
        }
*/
        getNext():ModelImage {
            this.current++;
            if (this.current >= this.data.length) this.current = 0;
           // this.data[this.current].name=this.current.toString();
            return this.data[this.current]
        }

        getPrev():ModelImage {
            this.current--;
            if (this.current < 0) this.current = this.data.length - 1;

            // var cont = new Container();

            return this.data[this.current]
        }

      /*  setImageSize(num:number) {
            var ar = this.images;

            for (var i = 0, n = ar.length; i < n; i++) {
                console.log(ar[i].getBounds());
            }
        }*/

       /* loadThumbs(ar:VOImage[]):Container[]{
            var out:Container[]= [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                out.push(new ModelImage(ar[i]));
            }
            return out;
        }*/

    }

}