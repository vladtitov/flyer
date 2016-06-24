/**
 * Created by Администратор on 16.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>
;
var hallmark;
(function (hallmark) {
    var ShopingCart = (function () {
        function ShopingCart() {
            this.$list = $("#shopinglist");
        }
        ShopingCart.prototype.addItem = function ($img) {
            $img = $($img);
            var cont = this.addPlaceHolder();
            cont.hide();
            cont.show("slow");
            var offset = this.$list.offset();
            $img.addClass("trans");
            $img.offset(offset);
            setTimeout(function () {
                $img.removeClass("trans");
                offset.left = 0;
                offset.top = 0;
                $img.offset(offset);
                cont.append($img).css("background-color", "#fff");
                var hammertime = new Hammer($img.get(0));
                hammertime.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
                hammertime.on("swipedown", function (evt) {
                    cont.addClass("trans removeimage");
                    setTimeout(function () {
                        $img.remove();
                        cont.hide("slow");
                    }, 1000);
                    hammertime.off("swipedown");
                });
            }, 1000);
        };
        ShopingCart.prototype.addPlaceHolder = function () {
            return $("<li>").prependTo(this.$list);
        };
        ShopingCart.prototype.ab = function () {
            /*var $img = this.$image;
            if (!$img) return;
            if (this.currentX<100 && this.currentY>360 ) {
                this.removeDrag ();
                $img.animate ({opacity: 0.1, left:20, top: 450}, 1000);
                $img.appendTo('#shopcartitems');
                $img.addClass("item");
                $img.animate ({opacity: 1}, 1000);
                $('#shopcartitems').css("display","block");
                $img.hammer().on("swipedown", (evt) => {
                    console.log("SW");
                    $img.remove();
                    $img.off("swipedown");
                });
                this.reset ();
            }*/
        };
        return ShopingCart;
    }());
    hallmark.ShopingCart = ShopingCart;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ShopingCart_back.js.map