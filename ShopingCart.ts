/**
 * Created by Администратор on 16.06.2016.
 */

/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>

interface JQuery {
    hammer ():JQuery;
}

module hallmark {
    export class  ShopingCart {
        $list:JQuery;
        constructor () {
            this.$list = $("#shopinglist");
        }

        addItem ($img:JQuery) {
            $img = $($img);
            var cont:JQuery = this.addPlaceHolder();
            cont.hide();
            cont.show("slow");
            var offset = this.$list.offset();
            $img.addClass("trans");
            $img.offset(offset);
            setTimeout( () => {
                $img.removeClass("trans");
                offset.left = 0;
                offset.top = 0;
                $img.offset(offset);
                cont.append($img).css("background-color", "#fff");
                var hammertime = new Hammer($img.get(0));
                hammertime.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
                hammertime.on("swipedown", (evt) => {
                    cont.addClass("trans removeimage");
                    setTimeout( () => {
                        $img.remove();
                        cont.hide("slow");
                    }, 1000);
                    hammertime.off("swipedown");
                });
            },1000);
        }
        
        private addPlaceHolder ():JQuery {
            return $("<li>").prependTo(this.$list);
        }

        showItem () {
            $('#shopcartitems').css("display","block");
            $('#spin').css("display","none");
            $('#shopcart').unbind("click");
        }
        
        toggleView () {
            $('#shopcart').click(function() {
                $('#shopcartitems').toggle();
                $('#spin').toggle();
            });
        }
    }
}
