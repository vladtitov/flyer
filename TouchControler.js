/**
 * Created by Администратор on 15.06.2016.
 */
///<reference path="Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var TouchControler = (function () {
        function TouchControler(view) {
            this.view = view;
            this.trigger = $({});
            this.init();
        }
        TouchControler.prototype.init = function () {
            var _this = this;
            this.view.addEventListener('mousedown', function (evt) {
                _this.isMove = false;
                _this.isHold = false;
                console.log('mousedowm');
                _this.pointerid = evt.pointerID;
                _this.prev = evt.stageY;
                _this.pressStart = evt.stageY;
                if (Math.abs(_this.speed) > 5)
                    _this.pressStart = 0;
                _this.speed = 0;
                clearTimeout(_this.holdTimer);
                _this.holdTimer = setTimeout(function () {
                    _this.isHold = true;
                    _this.onPressHold(evt);
                }, 1000);
            });
            this.view.addEventListener('pressup', function (evt) {
                if (_this.isHold)
                    return;
                if (_this.holdTimer !== 0) {
                    clearTimeout(_this.holdTimer);
                    _this.holdTimer = 0;
                }
                if (_this.pressStart !== 0 && Math.abs(_this.pressStart - evt.stageY) < 6) {
                }
                _this.pointerid = -1;
                var self = _this;
                if (Math.abs(_this.speed) > 5) {
                    _this.isMove = true;
                }
            });
            this.view.addEventListener('pressmove', function (evt) {
                if (_this.isHold)
                    return;
                if (evt.pointerID !== _this.pointerid)
                    return;
                var now = evt.stageY;
                var d = now - _this.prev;
                _this.prev = now;
                if (d !== 0) {
                    _this.resetHold();
                    _this.move(d);
                }
            });
        };
        TouchControler.prototype.resetHold = function () {
            if (this.holdTimer !== 0) {
                clearTimeout(this.holdTimer);
                this.holdTimer = 0;
            }
        };
        TouchControler.prototype.move = function (d) {
        };
        TouchControler.prototype.onPressHold = function (evt) {
            this.trigger.triggerHandler(TouchControler.PRESS_HOLD, evt.target);
        };
        TouchControler.PRESS_HOLD = "PRESS_HOLD";
        return TouchControler;
    }());
    hallmark.TouchControler = TouchControler;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=TouchControler.js.map