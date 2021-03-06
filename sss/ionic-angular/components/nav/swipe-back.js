"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var slide_edge_gesture_1 = require('../../gestures/slide-edge-gesture');
var util_1 = require('../../util/util');
var SwipeBackGesture = (function (_super) {
    __extends(SwipeBackGesture, _super);
    function SwipeBackGesture(element, options, _nav) {
        _super.call(this, element, util_1.assign({
            direction: 'x',
            maxEdgeStart: 75
        }, options));
        this._nav = _nav;
    }
    SwipeBackGesture.prototype.canStart = function (ev) {
        // the gesture swipe angle must be mainly horizontal and the
        // gesture distance would be relatively short for a swipe back
        // and swipe back must be possible on this nav controller
        if (ev.angle > -40 &&
            ev.angle < 40 &&
            ev.distance < 50 &&
            this._nav.canSwipeBack()) {
            // passed the tests, now see if the super says it's cool or not
            return _super.prototype.canStart.call(this, ev);
        }
        // nerp, not today
        return false;
    };
    SwipeBackGesture.prototype.onSlideBeforeStart = function () {
        void 0;
        this._nav.swipeBackStart();
    };
    SwipeBackGesture.prototype.onSlide = function (slide) {
        var stepValue = (slide.distance / slide.max);
        void 0;
        this._nav.swipeBackProgress(stepValue);
    };
    SwipeBackGesture.prototype.onSlideEnd = function (slide, ev) {
        var shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);
        var currentStepValue = (slide.distance / slide.max);
        void 0;
        this._nav.swipeBackEnd(shouldComplete, currentStepValue);
    };
    return SwipeBackGesture;
}(slide_edge_gesture_1.SlideEdgeGesture));
exports.SwipeBackGesture = SwipeBackGesture;
