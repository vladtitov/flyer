/**
 * Created by Администратор on 15.06.2016.
 */
///<reference path="Gallery4.ts"/>
var hallmark;
(function (hallmark) {
    var TouchControler = (function () {
        //isHold:boolean;
        //  target
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
                //  this.isHold = false;
                _this.pointerid = evt.pointerID;
                //   this.prev = evt.stageY;
                _this.startX = evt.stageX;
                _this.startY = evt.stageY;
                _this.prevX = _this.startX;
                _this.prevY = _this.startY;
                //  this.pressStart = evt.stageY;
                // if (Math.abs(this.speed) > 5) this.pressStart = 0;
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
                /*  var x:number = evt.startX;
                  var y:number = evt.startY;
                  if(Math.abs(this.startX-x)+Math.abs(this.startY-y)<6){
      
                  }*/
                // if (this.isHold) return;
                // if(this.holdTimer !==0){
                //   clearTimeout(this.holdTimer);
                // this.holdTimer=0;
                // }
                //    if (this.pressStart !== 0 && Math.abs(this.pressStart - evt.stageY) < 6) {
                //if (ImagesColumn.onImageClick)ImagesColumn.onImageClick(evt.target)
                //   }
                _this.pointerid = -1;
                //  var self = this;
                // if (Math.abs(this.speed) > 5) {
                //  this.isMove = true;
                // }
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
                    _this.isSpin = false;
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
        /* private resetHold():void{
             if(this.holdTimer !==0){
                 clearTimeout(this.holdTimer);
                 this.holdTimer=0;
             }
         }*/
        TouchControler.prototype.move = function (d) {
        };
        TouchControler.prototype.spin = function (speed) {
            this.isMove = true;
            this.isSpin = true;
            this.speed = speed;
            this.view.removeAllEventListeners();
            this.move(speed);
        };
        TouchControler.prototype.onPressHold = function (evt) {
            // this.trigger.triggerHandler(TouchControler.PRESS_HOLD,evt.target);
        };
        return TouchControler;
    }());
    hallmark.TouchControler = TouchControler;
})(hallmark || (hallmark = {}));
//# sourceMappingURL=TouchControler.js.map