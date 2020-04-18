import songList from './songList.js';
// import { prototype } from 'vue/types/umd';
let player = document.querySelector('.player');
console.log(songList);
/** @type {HTMLCanvasElement} */
/** @type {HTMLAudioElement} */
function AudioPlayer(root, songNum, playWay) {

    this.songIndex = 0;
    this.root = root;
    this.count = 100;
    this.timer = null;
    this.bgcTimer = null;
    this.songNum = songNum;
    this.playWay = playWay;

    //dom
    this.audio = this.root.querySelector('.audio');
    this.prev = this.root.querySelector('.prev');
    this.isplay = this.root.querySelector('.isplay');
    this.next = this.root.querySelector('.next');
    this.songCover = this.root.querySelector('.songCover');
    this.site = this.root.querySelector('.site');
    this.progress = this.root.querySelector('.progress');
    this.dragPoint = this.root.querySelector('.dragPoint');
    this.iconfont = this.root.querySelector('.iconfont');
    this.show = this.root.querySelector('.show');
    this.bgcMask = this.root.querySelector('.bgcMask');
    this.lyricsDomain = this.root.querySelector('.lyricsDomain');

    this.init();
}
//事件初始化
AudioPlayer.prototype.init = function() {
        this.changeBgColor();
        let that = this;
        this.upSourceDate();
        // 页面初始化数据更新
        // this.root.canplay = function() {
        //     console.log('keyi');
        // }
        // this.lyric(songList[0].lrc.lyric);
        this.audio.addEventListener("canplay", function() {
            //监听audio是否加载完毕
            // let lyricText = songList[this.songIndex].lrc.lyric;
            that.lyricUpDate();
            that.upProgressDate();
        });

        // this.audio.src = this.getSongUrl(songList[this.songIndex].id);
        this.isplay.onclick = () => {
            if (that.audio.paused) {
                that.playAudio();
            } else {
                that.stopAudio();
            }
        }

        this.prev.onclick = () => {
            this.prevSong();
            console.log('prev');
        }

        this.next.onclick = () => {
            this.nextSong();
            // console.log(this.audio.currentTime);
        };
        // 歌曲帧变化监听事件
        this.audio.ontimeupdate = () => {
            //更新歌曲当前播放进度条
            if (this.audio.readyState == 4) {
                console.log('音频准备就绪');
                this.playbackProgress(this.site);
            }

            if (this.audio.ended) {
                this.playWay == 0 ? this.listOrderPlay() : this.playWay;
                this.playWay == 1 ? this.randomPlay() : this.playWay;
                this.playWay == 2 ? this.singleTuneCirculation() : this.playWay;
            }
            // if (this.audio.currentTime == this.audio.duration) {
            //     console.log(this.songIndex);
            //     this.listOrderPlay();
            // }

        };
        //点击进度条跳转歌曲进度
        this.site.onmousedown = function(e) {
            let ev = window.event || e;
            console.log('click');
            ev.button == 0 ? that.jump(ev) : ev;
        };
        // 拖拽歌曲进度条
        this.dragPoint.onmousedown = function(e) {
            let ev = window.event || e;
            console.log('a');
            that.audio.muted = true;
            window.onmousemove = function(e) {
                let ev = window.event || e;
                that.jump(ev);
                console.log(that.dragPoint.offsetLeft);
                console.log(ev.pageX - that.dragPoint.offsetLeft, e.pageY - that.dragPoint.offsetLeft);
                // }
            };
        };
        window.onmouseup = function(e) {
            window.onmousemove = null;
            that.audio.muted = false;
        };
        //移动端进度条拖拽
        this.dragProgress();
        // 改变播放顺序
        this.iconfont.onclick = function() {

            that.count = 100;
            clearInterval(that.timer);
            that.show.style.display = 'block';

            that.playWay >= 2 ? that.playWay = 0 : that.playWay++;

            switch (that.playWay) {
                case 0:
                    this.className = 'iconfont icon-shunxubofang';
                    let shunxu = '顺序播放';
                    that.showText(shunxu);
                    break;
                case 1:
                    this.className = 'iconfont icon-suijibofang';
                    let suiji = '随机播放';
                    that.showText(suiji);
                    break;
                case 2:
                    this.className = 'iconfont icon-danquxunhuan';
                    let xunhuan = '循环播放';
                    that.showText(xunhuan);
                    break;
            }
        }
    }
    //播放
AudioPlayer.prototype.playAudio = function() {
    console.log('播放');
    this.audio.play();
    this.isplay.firstChild.className = 'fa fa-stop-circle fa-5x';
    // this.songCover.
    this.songCover.style.animationPlayState = 'running';
};
// 停止
AudioPlayer.prototype.stopAudio = function() {
    this.audio.pause();
    this.isplay.firstChild.className = 'fa fa-play-circle fa-5x';
    document.getElementById('img').style.animationPlayState = 'paused';
};
//更新歌曲进度
AudioPlayer.prototype.playbackProgress = function(site) {
    let bili = this.site.offsetWidth / 100;
    let time = this.audio.currentTime / this.audio.duration * 100 * bili;
    this.progress.style.width = time + 'px';
    this.dragPoint.style.left = time - this.dragPoint.offsetWidth / 2 + 'px';
    this.upProgressDate();
};
//更新歌词
AudioPlayer.prototype.lyricUpDate = function(text) {
    let lyricText = songList[this.songIndex].lrc.lyric;
    let pattern = /\[\d{2}:\d{2}.\d{3}\]|\[\d{2}:\d{2}.\d{2}\]/g;
    console.log('[00:00:00]'.match(pattern));

    let result = [];
    if (lyricText != '纯音乐，暂无歌词') {
        let rows = lyricText.split('\n');
        rows[rows.length - 1].length === 0 && rows.pop();

        rows.forEach(function(item, index, arr) {
            if (item.length <= 15) {
                rows.splice(index, 1);
            }
            let time = item.match(pattern);
            result.push(time);

            // let k = time[0].toLocaleString();
            // time = time.toString();
            let value = item.replace(pattern, '');
            console.log(time);
            // console.log(k);

            // result = time;

            // time.forEach(function(item, index, arr) {
            //     var t = item.slice(1, -1).split(':');
            //     //将结果压入最终数组
            //     result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
            //     console.log(item);

            // })
        })

        console.log(rows);
        console.log(result);
        // result.forEach(function(item, index, arr) {
        //     console.log(item[0]);

        // })

    }
    //                参考结果解析匹配歌词
    this.lyricsDomain.innerHTML = '';
};
//点击改变歌曲当前帧
AudioPlayer.prototype.jump = function(ev) {
    this.audio.currentTime = (ev.pageX - this.site.offsetParent.offsetLeft - this.site.offsetLeft) / (this.site.offsetWidth) * this.audio.duration;
    this.playbackProgress(this.site);
};
//更新页面数据
AudioPlayer.prototype.upProgressDate = function() {

    let currentMinute = Math.floor(this.audio.currentTime / 60);
    let currentSecond = Math.floor(this.audio.currentTime % 60);
    Math.floor(this.audio.currentTime / 60) < 10 ? currentMinute = '0' + currentMinute : currentMinute = currentMinute;
    Math.floor(this.audio.currentTime % 60) < 10 ? currentSecond = '0' + currentSecond : currentSecond = currentSecond;

    let songMinute = Math.floor(this.audio.duration / 60);
    let songSecond = Math.floor(this.audio.duration % 60);
    Math.floor(this.audio.duration / 60) < 10 ? songMinute = '0' + songMinute : songMinute = songMinute;
    Math.floor(this.audio.duration % 60) < 10 ? songSecond = '0' + songSecond : songSecond = songSecond;
    document.querySelector('.currentProgress').innerHTML = `${currentMinute}:${currentSecond}`;
    document.querySelector('.totalProgress').innerHTML = `${songMinute}:${songSecond}`;

};
AudioPlayer.prototype.upSourceDate = function() {
    let newUrl = this.getSongUrl(songList[this.songIndex].id);

    //切换音频
    this.audio.src = `${newUrl}`;

    //切换歌曲封面
    this.songCover.src = songList[this.songIndex].imgUrl;
    //重置歌曲封面动画
    this.songCover.classList.remove('rotate');
    this.songCover.classList.add('rotate');
    // document.querySelector('img').style.transform = 'rotate(0deg)';
};
// 获取音频资源
AudioPlayer.prototype.getSongUrl = function(id) {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};
//切换下一首歌曲
AudioPlayer.prototype.nextSong = function() {

    console.log('当前歌曲:' + this.songIndex);
    if (this.songIndex >= this.songNum) {
        this.songIndex = 0;
        //更新数据
        this.upSourceDate();
        this.playAudio();
    } else {
        this.songIndex++;
        //更新数据
        console.log('当前歌曲:' + this.songIndex);
        this.upSourceDate();
        this.playAudio();
        if (this.audio.readyState == 4) {
            console.log('音频准备就绪');
        }
    }
};
//切换上一首歌曲
AudioPlayer.prototype.prevSong = function() {

    // console.log(this.songIndex);
    if (this.songIndex <= 0) {
        this.songIndex = 2;
        this.upSourceDate();
        this.playAudio();
    } else {
        this.songIndex--;
        //更新数据
        this.upSourceDate();
        this.playAudio();
    }
};
//列表顺序播放
AudioPlayer.prototype.listOrderPlay = function() {
    this.nextSong();
};
//随机播放
AudioPlayer.prototype.randomPlay = function() {
    this.songIndex = Math.floor(Math.random() * songList.length);
    console.log(this.songIndex);
    this.upSourceDate();
    this.playAudio();
};
//单曲循环
AudioPlayer.prototype.singleTuneCirculation = function() {
    this.songIndex = this.songIndex;
    this.upSourceDate();
    this.playAudio();
};
//播放顺序弹窗
AudioPlayer.prototype.showText = function(text) {
    let that = this;
    this.show.innerHTML = text;
    this.timer = setInterval(() => {
        if (that.count <= 0) {
            that.count = 100;
            that.show.style.display = 'none';
            clearInterval(that.timer);
        } else {
            that.count--;
            that.show.style.opacity = `${that.count/100}`
        }
        console.log(that.count);
    }, 30)

};
AudioPlayer.prototype.dragProgress = function() {
    let that = this;
    this.dragPoint.addEventListener('touchstart', function(e) {
        let ev = e || window.event;
        let touch = ev.targetTouches[0];
        console.log(touch.clientX);
        console.log(this.offsetLeft);
        console.log(that.progress.offsetLeft);

        that.dragPoint.addEventListener('touchmove', function(e) {
            let ev = e || window.event;
            let touch = ev.targetTouches[0];
            e.preventDefault();
            console.log('拖动中');
            console.log(touch.pageX);
            console.log(that.dragPoint.offsetLeft);
            that.audio.muted = true;
            that.jump(touch);
        })
        that.dragPoint.addEventListener('touchend', function(e) {
            let ev = e || window.event;
            e.preventDefault();
            that.audio.muted = false;
            console.log('拖动结束');
        })
    })

};
//更改播放器背景色
AudioPlayer.prototype.changeBgColor = function() {
    let that = this;
    let [red, green, blue] = [0, 0, 0];
    let isEnd = false;
    this.bgcTimer = setInterval(() => {
        if (!isEnd) {
            if (red >= 255) {
                red = 255;
                green++;
                if (green >= 255) {
                    green = 255;
                    blue++;
                    if (blue >= 255) {
                        blue = 255;
                        isEnd = true;
                    }
                }
            } else {
                red++;
            }
        } else {
            if (blue >= 255) {
                blue = 255;
                green--;
                if (green <= 0) {
                    green = 0;
                    red--;
                    if (red <= 0) {
                        blue--;
                    }
                }
            } else {
                blue--;
                if (blue <= 0) {
                    isEnd = false;
                }
            }
        }
        // console.log(red, green, blue);
        that.bgcMask.style.backgroundColor = `rgba(${red},${green},${blue},0.5)`
    }, 100)
}
AudioPlayer.prototype.lyric = function(text) {

}
let audioPlayer = new AudioPlayer(player, songList.length - 1, 0);
/** vue接管的歌词部分 */
// let app = new Vue({
//     el: "#app",
//     data: {
//         lyric: 'kk',
//     },
//     methods: {
//         show() {
//             console.log(this.lyric);

//         },
//         lyricSwitch() {
//             console.log(audioPlayer.songIndex);
//         }
//     },
// beforeCreate() {
//     console.log(this.lyric);
//     this.lyric = `${songList[audioPlayer.songIndex].lrc.lyric}`
// }
// })