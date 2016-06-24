/**
 * Created by Администратор on 16.06.2016.
 */
/// <reference path="typings/easeljs.d.ts" />
///<reference path="typings/hammerjs/hammerjs.d.ts"/>
///<reference path="typings/jquery.d.ts"/>
///<reference path="ModelImage.ts"/>
var hallmark;
(function (hallmark) {
    var ShopingCart = (function () {
        function ShopingCart() {
            this.$list = $("#shopinglist");
        }
        ShopingCart.prototype.addItem = function (model) {
            model.resetElement().renderTransform();
            var $img = model.$image;
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
        return ShopingCart;
    }());
    hallmark.ShopingCart = ShopingCart;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ShopingCart.js.map