'use strict';

export class TimelineController {
    constructor(playBtn, timeline, frameNumLbl, numFrames, playFnc, pauseFnc, setFrameFnc) {
        this.PlayBtn = playBtn;
        this.Timeline = timeline;
        this.FrameNumLbl = frameNumLbl;
        this.NumFrames = numFrames;
        this.Playing = false;
        this.PlayFnc = playFnc;
        this.PauseFnc = pauseFnc;
        this.SetFrameFnc = setFrameFnc;

        this.Timeline.value = 0;
        this.Timeline.min = 0;
        this.Timeline.max = numFrames-1;
        this.Timeline.step = 'any';
        this.FrameNumLbl.innerHTML = 1;

        this.onPlayListener = () => this.handlePlayBtn();
        this.timelineInputListener = () => this.handleTimeLineInput();
        this.timelineKeyListener = (event) => {
            if (event.keyCode === 37) {
                const currentVal = parseFloat(this.Timeline.value);
                if (currentVal<=this.Timeline.min) {
                    this.Timeline.value = this.Timeline.min;
                }
                else {
                    this.Timeline.value=currentVal-1;
                }
            }
            if (event.keyCode === 39) {
                const currentVal = parseFloat(this.Timeline.value);
                if (currentVal>=this.Timeline.max) {
                    this.Timeline.value = this.Timeline.max;
                }
                else {
                    this.Timeline.value=currentVal+1;
                }
            }
            this.handleTimeLineInput();
            event.preventDefault();
        }
        this.PlayBtn.addEventListener('click', this.onPlayListener);
        this.Timeline.addEventListener('input', this.timelineInputListener);
        this.Timeline.addEventListener('keydown', this.timelineKeyListener);
    }

    dispose() {
        this.PlayBtn.removeEventListener('click', this.onPlayListener);
        this.Timeline.removeEventListener('input', this.timelineInputListener);
        this.Timeline.removeEventListener('keydown', this.timelineKeyListener);
    }

    handlePlayBtn() {
        if (this.Playing) {
            this.pausePress();
            this.PauseFnc();
        }
        else {
            this.playPress();
            this.PlayFnc(parseFloat(this.Timeline.value));
        }
    }

    handleTimeLineInput() {
        this.FrameNumLbl.innerHTML = Math.floor(this.Timeline.value) + 1;
        this.SetFrameFnc(this.Timeline.value);
    }

    pausePress() {
        this.PlayBtn.classList.remove('pause');
        this.PlayBtn.classList.add('play');
        this.Playing = false;
    }

    playPress() {
        this.PlayBtn.classList.remove('play');
        this.PlayBtn.classList.add('pause');
        this.Playing = true;
    }

    updateTimeLine(frameNum) {
        this.Timeline.value = frameNum;
        this.FrameNumLbl.innerHTML = Math.floor(frameNum) + 1;
    }
}