/**
 * Created by Администратор on 15.06.2016.
 */
///<reference path="../Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var TouchControler = (function () {
        function TouchControler(view) {
            this.view = view;
            this.trigger = $({});
            this.events = {};
            this.init();
        }
        TouchControler.prototype.on = function (event, callBack) {
            if (!this.events[event])
                this.events[event] = [];
            this.events[event].push(callBack);
            return this;
        };
        TouchControler.prototype.init = function () {
            var _this = this;
            this.view.addEventListener('mousedown', function (evt) {
                _this.isMove = false;
                _this.pointerid = evt.pointerID;
                _this.startX = evt.stageX;
                _this.startY = evt.stageY;
                _this.prevX = _this.startX;
                _this.prevY = _this.startY;
                clearTimeout(_this.clickTimer);
                if (_this.speed === 0)
                    _this.clickTimer = setTimeout(function () {
                        _this.clickTimer = 0;
                    }, 300);
                _this.speed = 0;
            });
            this.view.addEventListener('pressup', function (evt) {
                if (_this.isMove)
                    return;
                if (_this.clickTimer !== 0)
                    _this.onClick(evt);
                _this.pointerid = -1;
            });
            this.view.addEventListener('pressmove', function (evt) {
                //  if (this.isHold) return;
                if (evt.pointerID !== _this.pointerid)
                    return;
                var nowY = evt.stageY;
                var nowX = evt.startX;
                var d = nowY - _this.prevY;
                _this.prevY = nowY;
                _this.prevX = nowX;
                if (d !== 0) {
                    _this.speed = d;
                    _this.isMove = true;
                    _this.move(d);
                }
            });
        };
        TouchControler.prototype.onClick = function (evt) {
            if (this.events['click'])
                this.events['click'].forEach(function (callBack) {
                    callBack(evt);
                });
        };
        TouchControler.prototype.move = function (d) {
        };
        TouchControler.prototype.onPressHold = function (evt) {
            // this.trigger.triggerHandler(TouchControler.PRESS_HOLD,evt.target);
        };
        return TouchControler;
    }());
    hallmark.TouchControler = TouchControler;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=SpinControler.js.map