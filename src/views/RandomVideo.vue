<template>
  <div style="position: relative; margin-top: 10px" :hidden="!hides">
    <vue3VideoPlay id="vueVideo" v-bind="options" :poster="poster" @error="errorLoad" />
  </div>
  <div style="position: relative; margin-top: 10px"  :hidden="hides">
    <vue3VideoPlay id="vueVideo2"  v-bind="options2" :poster="poster2" @error="errorLoad" />
  </div>
  <div style="margin-top: 10px;">
    <el-button type="primary" @click="clickEt" style="float:left; margin-left: 40%" >点击换一个</el-button>
  </div>

<!--  <div class="zan">-->
<!--    <el-icon size="50px" color="skyblue" @click="selectStar(id)">-->
<!--      <star v-if="star"></star>-->
<!--      <star-filled v-if="!star"></star-filled>-->
<!--    </el-icon>-->
<!--  </div>-->
</template>

<script>
// import {Star, StarFilled} from "@element-plus/icons-vue";
import axios from "axios";
import Vue3VideoPlay from "vue3-video-play/lib/video-play/main.vue";
import {ElMessage} from "element-plus";

export default {
  name: "VideoShow",
  components: {Vue3VideoPlay},
  data() {
    return {
      hides: true,
      onclicks: false,
      options: {
        width: '800px', //播放器高度
        height: '450px', //播放器高度
        color: "#409eff", //主题色
        speed: true, //关闭进度条拖动
        title: '', //视频名称
        pageFullScreen: false,
        fullscreen: true,
        loop:false,
        src: "https://api.yujn.cn/api/xjj.php?_t=0",
        controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'fullScreen'],
        autoPlay: true,
        currentTime:0,
      },
      options2: {
        width: '800px', //播放器高度
        height: '450px', //播放器高度
        color: "#409eff", //主题色
        speed: true, //关闭进度条拖动
        title: '', //视频名称
        pageFullScreen: false,
        fullscreen: true,
        loop:false,
        src: "https://api.yujn.cn/api/xjj.php?_t=0",
        controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'fullScreen'],
        autoPlay: true,
        currentTime:0,
      },
      poster: '',
      poster2: '',
      domainList: [],
      iterateeCount: 0,
      videoURI: '',
    }
  },
  created() {
    this.$nextTick(() => {
      let docHeight = document.documentElement.clientHeight;
      let docwidth = document.documentElement.clientWidth;
      console.log("可视区域高度", docHeight);
      this.options.width = docwidth + "px";
      this.options.height = docHeight * 0.90 + "px";
      this.options2.width = docwidth + "px";
      this.options2.height = docHeight * 0.90 + "px";
      // this.tabHeight = docHeight * 0.14 + 'px';
      // this.folderHeight = docHeight * 0.05 + 'px';
      console.log(this.cardHeight, this.tabHeight, this.folderHeight)
    });
    this.mount();
    this.preLoad();
  },
  methods: {
    mount() {
      if (this.onclicks) {
        return;
      }
      this.onclicks = true;
      axios.get(`${this.$domainUrl}/video/random`).then(e => {
        if (e.data.code === 200) {
          let data = e.data.data;
          this.domainList = data.domainList;
          this.videoURI = data.videoUri;
          this.options.src = data.domain + data.videoUri;
          this.poster = data.domain + '/' + data.prefix + '/' + data.suffix + '/' + data.thumbnail;
        }
        this.onclicks = false
      }).catch(error => {
        this.onclicks = false
            console.log("error" + error)
          }
      )
    },
    clickEt(){
     let vueVideo = document.getElementById("vueVideo");
      let vueVideo2 = document.getElementById("vueVideo2");
      if (this.onclicks) {
        return;
      }
      this.onclicks = true;
      this.hides = !this.hides;
      this.options2.currentTime = 0.567;
      this.options.currentTime = 0.567;
      this.preLoad();
      if (vueVideo2.muted || vueVideo.muted){
        if (this.hides) {
          vueVideo2.muted = true;
          vueVideo.muted = false;
        }else {
          vueVideo.muted = true;
          vueVideo2.muted = false;
        }
      }
      vueVideo.currentTime = 0;
      vueVideo2.currentTime = 0;
      this.onclicks = false;
    },
    preLoad() {
      axios.get(`${this.$domainUrl}/video/random`).then(e => {
        if (e.data.code === 200) {
          let data = e.data.data;
          this.domainList = data.domainList;
          this.videoURI = data.videoUri;
          if (this.hides) {
            this.options2.src = data.domain + data.videoUri;
            this.poster2 = data.domain + '/' + data.prefix + '/' + data.suffix + '/' + data.thumbnail;
          } else {
            this.options.src = data.domain + data.videoUri;
            this.poster = data.domain + '/' + data.prefix + '/' + data.suffix + '/' + data.thumbnail;
          }
        }
      }).catch(error => {
        this.onclicks = false
        console.log("error" + error)
      })
    },
    loadimg(res) {
      let data = JSON.parse(res);
      this.domainList = data.domainList;
      this.videoURI = data.videoUri;
      this.options.src = data.domain + data.videoUri;
      this.poster = data.domain + '/' + data.prefix + '/' + data.suffix + '/' + data.thumbnail;
    },

    getVideoUrl(id) {
      axios.get(`${this.$domainUrl}/video/${id}`).then(e => {
        if (e.data.code === 200) {
          if (e.data.data == null) {
            ElMessage.error("这个视频暂时有问题,换一个看看吧")
          } else {
            let dates = JSON.stringify(e.data.data);
            this.$setValue("video_" + id, dates)
            let data = e.data.data;
            this.domainList = data.domainList;
            this.videoURI = data.videoUri;
            this.options.src = data.domain + data.videoUri;
            this.poster = data.domain + '/' + data.prefix + '/' + data.suffix + '/' + data.thumbnail;

          }
        }
      })
    },
    errorLoad() {
      if (this.iterateeCount === this.domainList.length) {
        ElMessage.error("这个视频有点问题，换一个看看吧")
        return;
      }
      this.options.src = this.domainList[this.iterateeCount] + this.videoURI;
      console.log(this.options.src)
      this.iterateeCount++;
    }
  }
}
</script>

<style>
.zan{
  float: right;
  margin-top:500px;
  margin-right: 10px;
}
</style>