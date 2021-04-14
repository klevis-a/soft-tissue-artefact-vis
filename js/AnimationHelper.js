'use strict';

import {TimelineController} from "./TimelineController.js";
import {Trajectory} from "./Csv_Processor.js";

export class AnimationHelper {
    constructor(boneScene, numFrames, playBtn, timeline, frameNumLbl) {
        this.BoneScene = boneScene;
        this.NumFrames = numFrames;
        const playFnc = (frameNum) => this.play(frameNum);
        const pauseFnc = () => this.pause();
        const setFrameFnc = (frameNum) => this.setFrame(frameNum);
        this.TimelineController = new TimelineController(playBtn, timeline, frameNumLbl, this.NumFrames, playFnc, pauseFnc, setFrameFnc);
        this.CurrentAnimationFnc = (t) => this.renderNoAnimate(t);
        this.render();
    }

    dispose() {
        cancelAnimationFrame(this.RequestId);
        this.TimelineController.dispose();
    }

    play(frameNum) {
        this.StartFrame = frameNum;
        this.StartTime = performance.now();
        this.CurrentAnimationFnc = (t) => this.renderAnimate(t);
    }

    pause() {
        this.CurrentAnimationFnc = (t) => this.renderNoAnimate(t);
    }

    setFrame(frameNum) {
        this.CurrentAnimationFnc = (t) => this.renderNoAnimate(t);
        this.TimelineController.pausePress();
        this.BoneScene.updateToFrame(frameNum);
    }

    render(time) {
        this.CurrentAnimationFnc(time);
        this.BoneScene.renderSceneGraph();
        this.RequestId = requestAnimationFrame((t) => this.render(t));
    }

    renderNoAnimate(time) {
    }

    renderAnimate(time) {
        const timeDiff = time - this.StartTime;
        if (timeDiff > 0) {
            const currentFractionalFrame = (timeDiff/Trajectory.FRAME_PERIOD) + this.StartFrame;
            const currentFrame = Math.floor(currentFractionalFrame);
            this.BoneScene.updateToFrame(currentFractionalFrame);

            if (currentFrame>=(this.NumFrames-1)) {
                this.TimelineController.updateTimeLine(this.NumFrames-1);
                this.TimelineController.pausePress();
                this.CurrentAnimationFnc = (t) => this.renderNoAnimate(t);
            }
            else {
                this.TimelineController.updateTimeLine(currentFractionalFrame);
                this.CurrentAnimationFnc = (t) => this.renderAnimate(t);
            }
        }
    }

}