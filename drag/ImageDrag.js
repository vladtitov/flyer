/**
 * Created by Администратор on 14.06.2016.
 */
///<reference path="../Gallery4.ts"/>
///<reference path="DragControl.ts"/>
var hallmark;
(function (hallmark) {
    var ImageDrag = (function () {
        function ImageDrag() {
            this.trigger = $({});
            this.$testRec = $('<div>').attr('id', 'TestRec');
            this.$overlay = $("#overlay");
        }
        ImageDrag.prototype.setImage = function (model) {
            if (this.model)
                this.model.image3D.removeDragImage();
            this.model = model;
            this.$overlay.children().triggerHandler('remove_me');
            this.model.appendToDrag(this.$overlay);
        };
        return ImageDrag;
    }());
    hallmark.ImageDrag = ImageDrag;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=ImageDrag.js.map